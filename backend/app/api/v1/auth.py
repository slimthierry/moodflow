from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.security import get_current_user
from app.models.user_models import User
from app.schemas.auth_schemas import LoginRequest, RefreshTokenRequest, RegisterRequest, TokenResponse
from app.schemas.user_schemas import UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register")
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user = await AuthService.register(db, data)
    return {
        "success": True,
        "data": UserResponse.model_validate(user).model_dump(),
        "message": "User registered successfully",
    }


@router.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    tokens = await AuthService.login(db, data)
    return {"success": True, "data": tokens.model_dump()}


@router.post("/refresh")
async def refresh_token(data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    tokens = await AuthService.refresh_token(db, data.refresh_token)
    return {"success": True, "data": tokens.model_dump()}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "data": UserResponse.model_validate(current_user).model_dump(),
    }
