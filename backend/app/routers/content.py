from typing import List, Optional

from fastapi import APIRouter, Header, HTTPException, status

from ..auth.jwt_token_tools import verify_and_read_token
from ..dao.dao import Dao
from ..dao.exceptions import InvalidPlanIdModuleIdAssociationError
from ..models.lesson import Lesson
from ..models.module import Module
from ..models.plan import Plan
from ..models.response import Response
from fastapi import Header

router = APIRouter()
dao = Dao()


@router.post("/content/plans", tags=["Content Service"])
async def create_plan(plan: Plan, authorization: str = Header(None)) -> Plan:
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing.",
        )

    # Extract the token from the Authorization header
    token = authorization.split()[-1]

    user_id = verify_and_read_token(token)
    plan.ownerId = user_id
    result = dao.create_plan(plan)
    return result


@router.delete("/content/plans/{plan_id}", tags=["Content Service"])
async def delete_plan(plan_id: int, authorization: str = Header(None)) -> Response:
    """
    Delete a plan for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **plan_id**: planId to use to lookup plan.
    """
    user_id = verify_and_read_token(authorization.split()[-1])
    validate_provided_plan(user_id, plan_id=plan_id)

    if dao.delete_plan(plan_id):
        return Response(
            status="SUCCESS", message="Successfully deleted planId: " + str(plan_id)
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error encountered deleting plan.",
        )


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
    user_id = verify_and_read_token(authorization.split()[-1])
    validate_provided_plan(user_id, plan=plan)

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
    
    user_id = verify_and_read_token(authorization.split()[-1])
    result = dao.get_user_plans(user_id)
    return result

@router.get("/content/plans/{plan_id}", tags=["Content Service"])
async def get_user_plan_by_id(
    plan_id: int,
    authorization: str = Header(None)
) -> Plan:
    """
    Get a plan by ID for the user associated with the provided token.

    - **plan_id**: ID of the plan to retrieve.
    - **authorization**: Valid token from the auth request.
    """
    try:
        # Verify the token and get the user ID
        user_id = verify_and_read_token(authorization.split()[-1])
        
        # Fetch the plan by ID for the user
        plan = dao.get_user_plan_by_id(user_id, plan_id)
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/content/modules", tags=["Content Service"])
async def get_user_modules(authorization: str = Header(None)) -> List[Module]:
    """
    Get all modules for a given userId provided in the token.

    - **token**: valid token from auth request
    """
    user_id = verify_and_read_token(authorization.split()[-1])
    result = dao.get_user_modules(user_id)
    return result

@router.get("/content/modules/{module_id}", tags=["Content Service"])
async def get_user_module_by_id(
    module_id: int,
    authorization: str = Header(None)
) -> Plan:
    """
    Get a plan by ID for the user associated with the provided token.

    - **plan_id**: ID of the plan to retrieve.
    - **authorization**: Valid token from the auth request.
    """
    try:
        # Verify the token and get the user ID
        user_id = verify_and_read_token(authorization.split()[-1])
        
        # Fetch the plan by ID for the user
        plan = dao.get_user_module_by_id(user_id, module_id)
        
        if not plan:
            raise HTTPException(status_code=404, detail="Module not found")
        
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/content/modules", tags=["Content Service"])
async def create_module(module: Module, authorization: str = Header(None)) -> Plan:
    """
    Create a module for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **title**: Title of the module to create.

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(authorization.split()[-1])
    module.ownerId = user_id
    result = dao.create_module(module)
    return result


@router.delete("/content/modules/{module_id}", tags=["Content Service"])
async def delete_module(module_id: int, authorization: str = Header(None)) -> Response:
    """
    Delete a module for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **module_id**: id of the module to delete. Must exist for that user.
    """
    user_id = verify_and_read_token(authorization.split()[-1])
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
    user_id = verify_and_read_token(authorization.split()[-1])
    lesson.ownerId = user_id
    result = dao.create_lesson(lesson)
    return result


@router.delete("/content/lessons/{lesson_id}", tags=["Content Service"])
async def delete_lesson(lesson_id: int, authorization: str = Header(None)) -> Lesson:
    """
    delete a lesson for the userId provided in the token.

    - **authorization**: valid token from auth request.
    - **lesson_id**: id of the lesson to delete, must exist for the user.
    """
    user_id = verify_and_read_token(authorization.split()[-1])
    lesson = dao.get_lesson_by_id(lesson_id)

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="lesson with provided ID does not exist.",
        )

    if lesson.ownerId != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User requesting update does not own lesson provided.",
        )
    if dao.delete_lesson(lesson_id):
        return Response(
            status="SUCCESS", message="Successfully deleted lesson: " + str(lesson_id)
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete lesson",
        )
def validate_provided_plan(
    user_id: int, plan: Optional[Plan] = None, plan_id: Optional[int] = None
) -> bool:

    assert (
        plan is not None or plan_id is not None
    ), 'Either plan or planId must be provided to validate.'

    if plan:
        req_plan_id = plan.id
    else:
        req_plan_id = plan_id

    if not req_plan_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="planId must be provided to update an existing plan.",
        )

    stored_plan = dao.get_plan(req_plan_id)

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
    return True
