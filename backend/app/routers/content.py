from fastapi import APIRouter, HTTPException, status

from ..auth.jwt_token_tools import verify_and_read_token
from ..dao.dao import Dao
from ..models.create_module_request import CreateModuleRequest
from ..models.create_plan_request import CreatePlanRequest
from ..models.lesson import Lesson
from ..models.plan import Plan

router = APIRouter()
dao = Dao()


@router.post("/content/plans", tags=["Content Service"])
async def create_plan(request: CreatePlanRequest, token: str) -> Plan:

    user_id = verify_and_read_token(token)
    result = dao.create_plan(user_id, request.title, request.modules)

    if result:
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create learning plan",
        )


@router.post("/content/modules", tags=["Content Service"])
async def create_module(request: CreateModuleRequest, token: str) -> Plan:

    user_id = verify_and_read_token(token)
    result = dao.create_module(user_id, request.title)

    if result:
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create module.",
        )


@router.post("/content/lessons", tags=["Content Service"])
async def create_lesson(lesson: Lesson, token: str) -> Lesson:

    user_id = verify_and_read_token(token)
    lesson.ownerId = user_id
    result = dao.create_lesson(lesson)

    if result:
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create lesson.",
        )
