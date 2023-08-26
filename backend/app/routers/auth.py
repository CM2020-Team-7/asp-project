from fastapi import APIRouter, HTTPException, status

from ..auth.jwt_token_tools import get_auth_token
from ..dao.dao import Dao
from ..models.login_request import LoginRequest
from ..models.login_response import LoginResponse

router = APIRouter()
dao = Dao()


@router.post("/auth", tags=["Authentication Service"])
async def authenticate(request: LoginRequest) -> LoginResponse:

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
