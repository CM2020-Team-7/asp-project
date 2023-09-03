from typing import List

from fastapi import APIRouter, Header, HTTPException, status

from ..auth.jwt_token_tools import verify_and_read_token
from ..dao.dao import Dao
from ..dao.exceptions import InvalidPlanIdModuleIdAssociationError
from ..models.lesson import Lesson
from ..models.module import Module
from ..models.plan import Plan
from ..models.response import Response

router = APIRouter()
dao = Dao()


@router.post("/content/plans", tags=["Content Service"])
async def create_plan(plan: Plan, authorization: str = Header(None)) -> Plan:
    """
    Create a plan for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **title**: Title of the plan to create.
    - **modules** (Optional): Optionally provide a list of module IDs to associate with the plan.

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(authorization)
    plan.ownerId = user_id
    result = dao.create_plan(plan)
    return result


@router.put("/content/plans", tags=["Content Service"])
async def update_plan(plan: Plan, authorization: str = Header(None)) -> Plan:
    """
    Update an existing plan to change title or modules.

    - **authorization**: valid token from auth request.
    - **planId**: id of the plan to update.
    - **title**: Title of the plan to update.
    - **modules** (Optional): Optionally provide a list of module IDs to associate with the plan.

    All other fields are ignored when provided, and returned based on what is updated.
    """
    user_id = verify_and_read_token(authorization)

    if not plan.id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="planId must be provided to update an existing plan.",
        )

    stored_plan = dao.get_plan(plan.id)

    if not stored_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan with provided ID does not exist.",
        )

    if stored_plan.ownerId != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User requesting update does not own plan provided.",
        )

    try:
        result = dao.update_plan(plan)
    except InvalidPlanIdModuleIdAssociationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid planId to moduleId association provided, please check IDs and resend request.",
        )

    return result


@router.get("/content/plans", tags=["Content Service"])
async def get_user_plans(authorization: str = Header(None)) -> List[Plan]:
    """
    Get a list of plans for the userId provided in the token.

    - **authorization**: valid token from auth request.
    """
    user_id = verify_and_read_token(authorization)
    result = dao.get_user_plans(user_id)
    return result


@router.get("/content/modules", tags=["Content Service"])
async def get_user_modules(authorization: str = Header(None)) -> List[Module]:
    """
    Get all modules for a given userId provided in the token.

    - **token**: valid token from auth request
    """
    user_id = verify_and_read_token(authorization)
    result = dao.get_user_modules(user_id)
    return result


@router.post("/content/modules", tags=["Content Service"])
async def create_module(module: Module, authorization: str = Header(None)) -> Plan:
    """
    Create a module for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **title**: Title of the module to create.

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(authorization)
    module.ownerId = user_id
    result = dao.create_module(module)
    return result


@router.delete("/content/modules/{module_id}", tags=["Content Service"])
async def create_module(module_id: int, authorization: str = Header(None)) -> Response:
    """
    Create a module for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **title**: Title of the module to create.

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(authorization)
    user_modules = dao.get_user_modules(user_id)
    module_found = False
    for module in user_modules:
        if module.id == module_id:
            module_found = True
            if dao.delete_module(module_id):
                return Response(
                    status="SUCCESS",
                    message="Successfully deleted moduleId" + str(module_id),
                )
            break  # Found, no need to continue looping if dao call unsuccessful.
    if not module_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="module with provided ID does not exist for this user.",
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="unable to delete module.",
        )


@router.post("/content/lessons", tags=["Content Service"])
async def create_lesson(lesson: Lesson, authorization: str = Header(None)) -> Lesson:
    """
    Create a lesson for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **title**: Title of the lesson to create.
    - **moduleId**: ID of the module to associate the lesson with.
    - **content**: Content of the lesson (stored as text).

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(authorization)
    lesson.ownerId = user_id
    result = dao.create_lesson(lesson)
    return result
