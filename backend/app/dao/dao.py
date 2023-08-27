import os
import sqlite3
from typing import Any, Dict, Tuple, Union

from ..models.user import User

DATA_ROOT = os.path.join(os.path.dirname(__file__), '../../db')


class Dao:
    def __init__(self, file: str = f'{DATA_ROOT}/database.db'):
        assert os.path.isfile(file), 'Provided database file does not exist. [{file}]'
        self.database_file = file
        self.conn = self.__connect()
        self.conn.row_factory = sqlite3.Row

    def get_user(self, username: str) -> Union[None, User]:
        query = "select * from user where username = ?"
        params = (username,)
        result = self.__get_row(query, params)
        if result:
            return User(**dict(result))
        else:
            return None

    def __connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.database_file)

    def __get_cursor(self) -> sqlite3.Cursor:
        return self.conn.cursor()

    def __get_row(
        self, query: str, params: Tuple[Any] = ()
    ) -> Union[None, sqlite3.Row]:
        result: Union[None, sqlite3.Row] = None
        try:
            cur = self.__get_cursor().execute(query, params)
            result = cur.fetchone()
        except:
            raise
        finally:
            cur.close()
        return result
