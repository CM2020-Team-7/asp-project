import datetime
from typing import Union

from pydantic import BaseModel


class Lesson(BaseModel):
    id: Union[int, None] = None
    ownerId: Union[int, None] = None
    moduleId: int
    title: str
    content: str
    createdOn: Union[datetime.datetime, None] = None
    lastModified: Union[datetime.datetime, None] = None
