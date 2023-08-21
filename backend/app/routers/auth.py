from fastapi import APIRouter

from ..auth.jwt_token_tools import get_auth_token
from ..models.login_request import LoginRequest
from ..models.login_response import LoginResponse

router = APIRouter()


@router.post("/auth", tags=["auth"])
async def authenticate(request: LoginRequest) -> LoginResponse:
    return LoginResponse(
        token=get_auth_token(1)
    )  # TODO: read from DB instead of returning.
