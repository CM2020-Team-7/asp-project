from fastapi import FastAPI

from app.routers import auth, content

app = FastAPI()
app.include_router(auth.router)
app.include_router(content.router)
