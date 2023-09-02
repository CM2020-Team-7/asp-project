from fastapi import APIRouter, HTTPException, status
from typing import Union

from ..auth.jwt_token_tools import get_auth_token
from ..dao.dao import Dao
from ..dao.exceptions import DuplicateDataError
from ..models.login_request import LoginRequest
from ..models.login_response import LoginResponse
from ..models.user import User

router = APIRouter()
dao = Dao()


@router.post("/auth", tags=["Authentication Service"])
async def authenticate(request: LoginRequest) -> LoginResponse:
    """
    Authenticate a registered user to receive a token.

    - **username**: username to authenticate
    - **password**: password to use.
    """

    user = dao.get_user(request.username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )

    if user.verify_password(request.password):
        return LoginResponse(token=get_auth_token(user.id))
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Password provided does not match user.",
        )


@router.post("/auth/register", tags=["Authentication Service"])
async def register(user: User) -> Union[User, dict]:
    """
    Register a user with the system.

    - **firstName**: first name for the user.
    - **lastName**: last name for the user.
    - **username**: username/email for the user.
    - **passwd**: password for the user.

    All other fields are ignored during user creation and provided back once user is created.
    """
    try:
        result = dao.create_user(user)
    except DuplicateDataError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with username [{user.username}] already exists.",
        )
    token=get_auth_token(user.id)
    response_data = {"user": result, "token": token}

    return response_data
