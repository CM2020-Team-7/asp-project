import base64
import datetime
import hashlib
from typing import Union

from pydantic import BaseModel


class User(BaseModel):

    firstName: str
    lastName: str
    username: str
    passwd: str

    id: Union[int, None] = None
    registeredOn: Union[datetime.datetime, None] = None
    lastModified: Union[datetime.datetime, None] = None

    def verify_password(self, value: str) -> bool:
        assert isinstance(
            self.passwd, str
        ), "User password must be str, has the password been set?"
        assert isinstance(value, str), "Provided password must be str."
        return self.passwd == self.get_password_hash(value)

    def get_hashed_password(self) -> str:
        assert isinstance(
            self.passwd, str
        ), "User password not str, password must be set."
        return self.get_password_hash(self.passwd)

    def get_password_hash(self, password: str) -> str:
        passwd = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode(),
            str(self.id).encode().zfill(32),
            100000,
            dklen=128,
        )
        return base64.b64encode(passwd).decode()
