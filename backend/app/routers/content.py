from typing import List

from fastapi import APIRouter, HTTPException, status

from ..auth.jwt_token_tools import verify_and_read_token
from ..dao.dao import Dao
from ..models.lesson import Lesson
from ..models.module import Module
from ..models.plan import Plan

router = APIRouter()
dao = Dao()


@router.post("/content/plans", tags=["Content Service"])
async def create_plan(plan: Plan, token: str) -> Plan:
    """
    Create a plan for the userId provided in the token.

    - **token**: valid token from auth request.
    - **title**: Title of the plan to create.
    - **modules** (Optional): Optionally provide a list of module IDs to associate with the plan.

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(token)
    plan.ownerId = user_id
    result = dao.create_plan(plan)
    return result


@router.get("/content/plans", tags=["Content Service"])
async def get_user_plans(token: str) -> List[Plan]:
    """
    Get a list of plans for the userId provided in the token.

    - **token**: valid token from auth request.
    """
    user_id = verify_and_read_token(token)
    result = dao.get_user_plans(user_id)
    return result


@router.get("/content/modules", tags=["Content Service"])
async def get_user_modules(token: str) -> List[Module]:
    """
    Get all modules for a given userId provided in the token.

    - **token**: valid token from auth request
    """
    user_id = verify_and_read_token(token)
    result = dao.get_user_modules(user_id)
    return result


@router.post("/content/modules", tags=["Content Service"])
async def create_module(module: Module, token: str) -> Plan:
    """
    Create a module for the userId provided in the token.

    - **token**: valid token from auth request.
    - **title**: Title of the module to create.

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(token)
    module.ownerId = user_id
    result = dao.create_module(module)
    return result


@router.post("/content/lessons", tags=["Content Service"])
async def create_lesson(lesson: Lesson, token: str) -> Lesson:
    """
    Create a lesson for the userId provided in the token.

    - **token**: valid token from auth request.
    - **title**: Title of the lesson to create.
    - **moduleId**: ID of the module to associate the lesson with.
    - **content**: Content of the lesson (stored as text).

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(token)
    lesson.ownerId = user_id
    result = dao.create_lesson(lesson)
    return result
