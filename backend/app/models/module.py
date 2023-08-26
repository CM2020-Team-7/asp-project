import datetime

from pydantic import BaseModel


class Module(BaseModel):
    id: int
    ownerId: int
    title: str
    createdOn: datetime.datetime
