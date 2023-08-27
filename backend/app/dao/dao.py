import os
import sqlite3
from typing import Any, List, Optional, Tuple, Union

from ..models.lesson import Lesson
from ..models.module import Module
from ..models.plan import Plan
from ..models.user import User
from .exceptions import DuplicateDataError

DATA_ROOT = os.path.join(os.path.dirname(__file__), '../../db')

SELECT_USER_ROWID = 'select * from user where rowid = ?'
SELECT_USER = 'select * from user where username = ?'
INSERT_USER = 'INSERT INTO User ("firstName", "lastName", "username", "passwd") VALUES (?, ?, ?, ?)'

SELECT_PLAN_ROWID = 'select * from plan where rowid = ?'
INSERT_PLAN = 'INSERT INTO Plan ("ownerId", "title") VALUES (?, ?)'

SELECT_MODULE_ROWID = 'select * from module where rowid = ?'
INSERT_MODULE = 'INSERT INTO Module ("ownerId", "title") VALUES (?, ?)'
ASSOCIATE_MODULE = (
    'INSERT INTO ModulePlanAssociation ("planId", "moduleId") VALUES (?, ?)'
)

SELECT_LESSON_ROWID = 'select * from lesson where rowid = ?'
INSERT_LESSON = (
    'INSERT INTO Lesson ("ownerId", "moduleId", "title", "content") VALUES (?, ?, ?, ?)'
)


class Dao:
    def __init__(self, file: str = f'{DATA_ROOT}/database.db'):
        assert os.path.isfile(file), 'Provided database file does not exist. [{file}]'
        self.database_file = file
        self.conn = self.__connect()
        self.conn.row_factory = sqlite3.Row

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

    def create_plan(
        self, owner_id: int, title: str, modules: Optional[List[int]]
    ) -> Plan:
        row_id = self.__write_data(INSERT_PLAN, (owner_id, title))

        if modules and len(modules) > 0:
            self.associate_modules_to_plan(row_id, modules)

        result = self.__get_row(SELECT_PLAN_ROWID, (row_id,))
        return Plan(**dict(result))

    def create_module(self, owner_id: int, title: str) -> Module:
        row_id = self.__write_data(INSERT_MODULE, (owner_id, title))
        result = self.__get_row(SELECT_MODULE_ROWID, (row_id,))
        return Module(**dict(result))

    def create_lesson(self, lesson: Lesson) -> Lesson:
        row_id = self.__write_data(
            INSERT_LESSON,
            (lesson.ownerId, lesson.moduleId, lesson.title, lesson.content),
        )
        result = self.__get_row(SELECT_LESSON_ROWID, (row_id,))
        return Lesson(**dict(result))

    def associate_modules_to_plan(self, plan_id: int, module_id_list: List[int]):
        data = [(plan_id, module_id) for module_id in module_id_list]
        self.__get_cursor().executemany(ASSOCIATE_MODULE, data)
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
