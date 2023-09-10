from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, content, enrollment

app = FastAPI()

allowed_origins = ["http://127.0.0.1:5173", "http://127.0.0.1:8000", "http://localhost:5173", "http://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(content.router)
app.include_router(enrollment.router)
