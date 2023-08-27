import datetime
from typing import List, Union

from pydantic import BaseModel


class Plan(BaseModel):
    title: str
    modules: Union[List[int], None] = []

    id: Union[int, None] = None
    ownerId: Union[int, None] = None
    createdOn: Union[datetime.datetime, None] = None
