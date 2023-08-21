import jwt

ALGORITHM = "HS256"
SECRET = "s3cr3t"


def get_auth_token(user_id: int) -> str:
    return jwt.encode({"userId": user_id}, SECRET, algorithm=ALGORITHM)


def read_auth_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])
