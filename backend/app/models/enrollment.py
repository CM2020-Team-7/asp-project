import datetime
import enum
from typing import Union

from pydantic import BaseModel, conint


class Status(enum.Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    COMPLETE = "Complete"


class Enrollment(BaseModel):
    planId: int
    endDate: datetime.datetime

    id: Union[int, None] = None
    userId: Union[int, None] = None
    status: Union[Status, None] = None
    startDate: Union[datetime.datetime, None] = None
    progress: Union[conint(ge=0, le=100), None] = None
