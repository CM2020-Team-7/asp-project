import datetime
from typing import List, Union

from pydantic import BaseModel

from .lesson import Lesson


class Module(BaseModel):
    title: str

    id: Union[int, None] = None
    ownerId: Union[int, None] = None
    createdOn: Union[datetime.datetime, None] = None
    lessons: Union[List[Lesson], None] = None
