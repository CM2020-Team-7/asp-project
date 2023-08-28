import os
import sqlite3
from typing import Any, List, Optional, Tuple, Union

from ..models.enrollment import Enrollment
from ..models.lesson import Lesson
from ..models.module import Module
from ..models.plan import Plan
from ..models.user import User
from .exceptions import DuplicateDataError, InvalidPlanIdModuleIdAssociationError

DATA_ROOT = os.path.join(os.path.dirname(__file__), '../../db')

ENABLE_FOREIGN_KEYS = 'PRAGMA foreign_keys=ON;'
SELECT_USER_ROWID = 'select * from user where rowid = ?'
SELECT_USER = 'select * from user where username = ?'
INSERT_USER = 'INSERT INTO User ("firstName", "lastName", "username", "passwd") VALUES (?, ?, ?, ?)'

SELECT_PLAN_ROWID = 'select * from plan where rowid = ?'
SELECT_PLANS = 'select * from plan where ownerId = ?'
SELECT_PLAN = 'select * from plan where id = ?'
INSERT_PLAN = 'INSERT INTO Plan ("ownerId", "title") VALUES (?, ?)'
SELECT_PLAN_MODULE_IDS = 'select moduleId from ModulePlanAssociation where planId = ?'
UPDATE_PLAN = 'UPDATE Plan SET title = ? where id = ?'


SELECT_MODULE_ROWID = 'select * from module where rowid = ?'
SELECT_MODULES = 'select * from module where ownerId = ?'
INSERT_MODULE = 'INSERT INTO Module ("ownerId", "title") VALUES (?, ?)'
ASSOCIATE_MODULE = (
    'INSERT INTO ModulePlanAssociation ("planId", "moduleId") VALUES (?, ?)'
)
DISASSOCIATE_MODULE = (
    'DELETE FROM ModulePlanAssociation where planId = ? and moduleId = ?'
)

SELECT_LESSON_ROWID = 'select * from lesson where rowid = ?'
INSERT_LESSON = (
    'INSERT INTO Lesson ("ownerId", "moduleId", "title", "content") VALUES (?, ?, ?, ?)'
)
SELECT_MODULE_LESSONS = 'select * from lesson where moduleId = ?'

SELECT_ENROLLMENT_ROWID = 'select * from Enrollment where rowid = ?'
INSERT_ENROLLMENT = (
    'INSERT INTO Enrollment ("userId", "planId", "endDate") VALUES (?, ?, ?)'
)
UPDATE_ENROLLMENT = (
    'Update Enrollment SET status = ?, endDate = ?, progress = ? where id = ?'
)
SELECT_ENROLLMENT = 'select * from Enrollment where id = ?'
SELECT_ENROLLMENTS = 'select * from Enrollment where userId = ?'
DELETE_ENROLLMENT = 'DELETE from Enrollment where id = ?'


class Dao:
    def __init__(self, file: str = f'{DATA_ROOT}/database.db'):
        assert os.path.isfile(file), 'Provided database file does not exist. [{file}]'
        self.database_file = file
        self.conn = self.__connect()
        self.conn.row_factory = sqlite3.Row
        self.conn.execute(ENABLE_FOREIGN_KEYS)

    def create_enrollment(self, enrollment: Enrollment) -> Enrollment:
        try:
            row_id = self.__write_data(
                INSERT_ENROLLMENT,
                (enrollment.userId, enrollment.planId, enrollment.endDate),
            )
        except sqlite3.IntegrityError as err:
            if "UNIQUE constraint failed" in str(err):
                raise DuplicateDataError("User already enrolled to plan.")
        return Enrollment(**dict(self.__get_row(SELECT_ENROLLMENT_ROWID, (row_id,))))

    def get_enrollment(self, enrollment: Enrollment) -> Union[Enrollment, None]:
        result = self.__get_row(SELECT_ENROLLMENT, (enrollment.id,))
        if result:
            return Enrollment(**dict(result))
        else:
            return None

    def update_enrollment(self, enrollment: Enrollment) -> Union[Enrollment, None]:
        self.__write_data(
            UPDATE_ENROLLMENT,
            (
                str(enrollment.status.value),
                enrollment.endDate,
                enrollment.progress,
                enrollment.id,
            ),
        )
        return self.get_enrollment(enrollment)

    def delete_enrollment(self, enrollment: Enrollment) -> bool:
        self.__write_data(DELETE_ENROLLMENT, (enrollment.id,))
        return True

    def get_user_enrollments(self, user_id: int) -> List[Enrollment]:
        results = self.__get_rows(SELECT_ENROLLMENTS, (user_id,))
        enrollments = []
        if results:
            for row in results:
                enrollments.append(Enrollment(**dict(row)))
        return enrollments

    def create_user(self, user: User) -> User:
        try:
            row_id = self.__write_data(
                INSERT_USER,
                (
                    user.firstName,
                    user.lastName,
                    user.username,
                    user.get_hashed_password(),
                ),
            )
        except sqlite3.IntegrityError as err:
            if "UNIQUE constraint failed: User.username" in str(err):
                raise DuplicateDataError("username already exists.")

        return User(**dict(self.__get_row(SELECT_USER_ROWID, (row_id,))))

    def create_user(self, user: User) -> User:
        try:
            row_id = self.__write_data(
                INSERT_USER,
                (
                    user.firstName,
                    user.lastName,
                    user.username,
                    user.get_hashed_password(),
                ),
            )
        except sqlite3.IntegrityError as err:
            if "UNIQUE constraint failed: User.username" in str(err):
                raise DuplicateDataError("username already exists.")

        return User(**dict(self.__get_row(SELECT_USER_ROWID, (row_id,))))

    def get_user(self, username: str) -> Union[None, User]:
        result = self.__get_row(SELECT_USER, (username,))
        if result:
            return User(**dict(result))
        else:
            return None

    def get_plan(self, plan_id: int) -> Union[None, Plan]:
        result = self.__get_row(SELECT_PLAN, (plan_id,))
        if result:
            plan = Plan(**dict(result))
            module_list = self.get_plan_module_id_list(plan.id)
            if module_list:
                plan.modules = module_list
            return plan
        else:
            return None

    def create_plan(self, plan: Plan) -> Plan:
        row_id = self.__write_data(INSERT_PLAN, (plan.ownerId, plan.title))

        if plan.modules and len(plan.modules) > 0:
            self.associate_modules_to_plan(row_id, plan.modules)

        result = self.__get_row(SELECT_PLAN_ROWID, (row_id,))
        return Plan(**dict(result))

    def update_plan(self, plan: Plan) -> Plan:
        self.__write_data(UPDATE_PLAN, (plan.title, plan.id))
        self.update_plan_modules(plan.id, plan.modules)
        return self.get_plan(plan.id)

    def update_plan_modules(
        self, plan_id: int, new_module_list: Union[List[int], None]
    ) -> Union[List[int], None]:
        existing_ids = self.get_plan_module_id_list(plan_id)
        if not existing_ids:
            self.associate_modules_to_plan(plan_id, new_module_list)
        else:
            delete_list = [id for id in existing_ids if id not in new_module_list]
            new_list = [id for id in new_module_list if id not in existing_ids]
            if len(delete_list) > 0:
                self.disassociate_modules_from_plan(plan_id, delete_list)
            if len(new_list) > 0:
                self.associate_modules_to_plan(plan_id, new_list)

        return self.get_plan_module_id_list(plan_id)

    def get_user_plans(self, user_id: str) -> List[Plan]:
        results = self.__get_rows(SELECT_PLANS, (user_id,))
        plans = []
        if results:
            for row in results:
                plan = Plan(**dict(row))
                modules = self.get_plan_module_id_list(plan.id)
                if modules:
                    plan.modules = modules
                plans.append(plan)
        return plans

    def create_module(self, module: Module) -> Module:
        row_id = self.__write_data(INSERT_MODULE, (module.ownerId, module.title))
        result = self.__get_row(SELECT_MODULE_ROWID, (row_id,))
        return Module(**dict(result))

    def get_user_modules(self, user_id: str) -> List[Module]:
        results = self.__get_rows(SELECT_MODULES, (user_id,))
        modules = []
        if results:
            for row in results:
                module = Module(**dict(row))
                lessons = self.get_module_lessons(module.id)
                if lessons:
                    module.lessons = lessons
                modules.append(module)
        return modules

    def create_lesson(self, lesson: Lesson) -> Lesson:
        row_id = self.__write_data(
            INSERT_LESSON,
            (lesson.ownerId, lesson.moduleId, lesson.title, lesson.content),
        )
        result = self.__get_row(SELECT_LESSON_ROWID, (row_id,))
        return Lesson(**dict(result))

    def get_module_lessons(self, module_id: int) -> Union[List[Lesson], None]:
        stored_lessons = None
        result = self.__get_rows(SELECT_MODULE_LESSONS, (module_id,))
        if result:
            stored_lessons = [Lesson(**dict(row)) for row in result]
        return stored_lessons

    def get_plan_module_id_list(self, plan_id: int) -> Union[List[int], None]:
        id_list = None
        result = self.__get_rows(SELECT_PLAN_MODULE_IDS, (plan_id,))
        if result:
            id_list = [row["moduleId"] for row in result]
        return id_list

    def associate_modules_to_plan(self, plan_id: int, module_id_list: List[int]):
        data = [(plan_id, module_id) for module_id in module_id_list]
        try:
            self.__get_cursor().executemany(ASSOCIATE_MODULE, data)
        except sqlite3.IntegrityError as err:
            if "FOREIGN KEY constraint failed" in str(err):
                raise InvalidPlanIdModuleIdAssociationError(
                    "Invalid planId to moduleId associaion provided."
                )
        self.conn.commit()
        return True

    def disassociate_modules_from_plan(self, plan_id: int, ids_to_remove: List[int]):
        data = [(plan_id, module_id) for module_id in ids_to_remove]
        try:
            self.__get_cursor().executemany(DISASSOCIATE_MODULE, data)
        except sqlite3.IntegrityError as err:
            if "FOREIGN KEY constraint failed" in str(err):
                raise InvalidPlanIdModuleIdAssociationError(
                    "Invalid planId to moduleId associaion provided."
                )
        self.conn.commit()
        return True

    def __connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.database_file)

    def __get_cursor(self) -> sqlite3.Cursor:
        return self.conn.cursor()

    def __write_data(self, query: str, params: Tuple[Any] = ()) -> int:
        cur = self.__get_cursor().execute(query, params)
        row_id = cur.lastrowid
        assert isinstance(row_id, int), 'Did not receive row_id from INSERT call.'
        cur.connection.commit()
        return row_id

    def __get_row(
        self, query: str, params: Tuple[Any] = ()
    ) -> Union[None, sqlite3.Row]:
        result: Union[None, sqlite3.Row] = None
        cur = self.__get_cursor().execute(query, params)
        result = cur.fetchone()
        return result

    def __get_rows(
        self, query: str, params: Tuple[Any] = ()
    ) -> Union[None, List[sqlite3.Row]]:
        result: Union[None, sqlite3.Row] = None
        cur = self.__get_cursor().execute(query, params)
        result = cur.fetchall()
        return result
