import jwt
from fastapi import HTTPException, status

ALGORITHM = "HS256"
SECRET = "s3cr3t"


def get_auth_token(user_id: int) -> str:
    return jwt.encode({"userId": user_id}, SECRET, algorithm=ALGORITHM)


def read_auth_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])


def verify_and_read_token(token: str) -> int:
    content = None
    try:
        content = read_auth_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Signature in provided token has expired.",
        )
    except jwt.exceptions.InvalidSignatureError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Signature in provided token is invalid.",
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to read provided token.",
        )
    return content['userId']
