import datetime

from pydantic import BaseModel


class Plan(BaseModel):
    id: int
    ownerId: int
    title: str
    createdOn: datetime.datetime
