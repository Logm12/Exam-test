from typing import Annotated
from fastapi import APIRouter
from app.api.endpoints import auth, exams, questions, organizations, question_pools, users, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(exams.router, prefix="/exams", tags=["exams"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(question_pools.router, prefix="/pools", tags=["question_pools"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(analytics.router, prefix="/admin/exams", tags=["analytics"])
