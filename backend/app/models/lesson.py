import datetime
from typing import Union

from pydantic import BaseModel


class Lesson(BaseModel):
    moduleId: int
    title: str
    content: str

    id: Union[int, None] = None
    ownerId: Union[int, None] = None
    createdOn: Union[datetime.datetime, None] = None
    lastModified: Union[datetime.datetime, None] = None
