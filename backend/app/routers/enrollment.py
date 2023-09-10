from typing import List

from fastapi import APIRouter, Header, HTTPException, status

from ..auth.jwt_token_tools import verify_and_read_token
from ..dao.dao import Dao
from ..models.enrollment import Enrollment
from ..models.response import Response

router = APIRouter()
dao = Dao()


@router.post("/enrollment", tags=["Enrollment Service"])
async def create_enrollment(
    enrollment: Enrollment, authorization: str = Header(None)
) -> Enrollment:
    """
    Enroll a user to a specific plan, containing module and lesson content.

    - **token**: valid token from auth request.
    - **planId**: planId to register user in token to.
    - **endDate**: target completion date for the plan.

    All other fields are ignored when provided, and returned based on what is created.
    """
    user_id = verify_and_read_token(authorization)
    enrollment.userId = user_id
    result = dao.create_enrollment(enrollment)
    return result


@router.get("/enrollment", tags=["Enrollment Service"])
async def get_user_enrollments(authorization: str = Header(None)) -> List[Enrollment]:
    """
    Get all enrollments for the userId in the token.

    - **token**: valid token from auth request.
    """
    user_id = verify_and_read_token(authorization)
    result = dao.get_user_enrollments(user_id)
    return result


@router.put("/enrollment", tags=["Enrollment Service"])
async def update_enrollment(
    enrollment: Enrollment, authorization: str = Header(None)
) -> Enrollment:
    """
    Update an existing enrollment for the userId in the token.

    - **token**: valid token from auth request.
    - **enrollmentId**: id of the enrollment to update.
    - **status**: status of the enrollment. (Not Started, In Progress, Complete)
    - **progress**: % complete for the plan/enrollment.
    - **endDate**: target completion date for the plan.

    All other fields are ignored when provided, and returned based on what exists after update.
    """
    user_id = verify_and_read_token(authorization)
    enrollment.userId = user_id
    verify_input_enrollment(user_id, enrollment)
    result = dao.update_enrollment(enrollment)
    return result


@router.delete("/enrollment", tags=["Enrollment Service"])
async def delete_enrollment(
    enrollment: Enrollment, authorization: str = Header(None)
) -> Response:
    """
    Delete an existing enrollment for the userId in the token.

    - **token**: valid token from auth request.
    - **enrollmentId**: id of the enrollment to update.

    All other fields are ignored when provided and only status, and message are returned.
    """
    user_id = verify_and_read_token(authorization)
    enrollment.userId = user_id
    verify_input_enrollment(user_id, enrollment)
    if dao.delete_enrollment(enrollment):
        return Response(
            status="OK", message=f"Enrollment id [{enrollment.id}] deleted."
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to delete enrollment [{enrollment.id}].",
        )


def verify_input_enrollment(user_id: str, enrollment: Enrollment) -> bool:
    if not enrollment.id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="id must be provided to update an existing enrollment.",
        )

    stored_enrollment = dao.get_enrollment(enrollment)

    if not stored_enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment with provided ID does not exist.",
        )

    if stored_enrollment.userId != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User requesting update does not own enrollment provided.",
        )
    return True
