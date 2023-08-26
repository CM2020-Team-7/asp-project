import base64
import datetime
import hashlib

from pydantic import BaseModel, root_validator


class User(BaseModel):
    id: int
    firstName: str
    lastName: str
    username: str
    passwd: str
    registeredOn: datetime.datetime
    lastModified: datetime.datetime

    def verify_password(self, value: str) -> bool:
        assert isinstance(
            self.passwd, str
        ), "User password must be str, has the password been set?"
        assert isinstance(value, str), "Provided password must be str."
        return self.passwd == self.get_password_hash(value)

    def get_password_hash(self, password: str) -> str:
        passwd = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode(),
            str(self.id).encode().zfill(32),
            100000,
            dklen=128,
        )
        return base64.b64encode(passwd).decode()
