from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()

@router.post("/register", response_model=UserSchema)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == user_in.username))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    db_user = User(
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role or "student"
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.post("/login")
async def login(
    db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    }

from pydantic import BaseModel

class GoogleAuthToken(BaseModel):
    token: str

@router.post("/google")
async def google_auth(
    token_in: GoogleAuthToken,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Verify the token with Google
        id_info = id_token.verify_oauth2_token(
            token_in.token, 
            google_requests.Request()
            # client_id=settings.GOOGLE_CLIENT_ID
        )
        
        email = id_info.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
            
        # Check if user exists
        result = await db.execute(select(User).where(User.username == email))
        user = result.scalars().first()
        
        # Auto-provision user if they do not exist
        if not user:
            user = User(
                username=email,
                password_hash=get_password_hash("oauth_no_password"),
                role="student"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
        access_token = create_access_token(subject=user.id)
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.username,
                "role": user.role
            }
        }
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google token"
        )
