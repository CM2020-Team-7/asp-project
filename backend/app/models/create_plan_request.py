from typing import List

from pydantic import BaseModel


class CreatePlanRequest(BaseModel):

    title: str
    modules: List[int] = []
