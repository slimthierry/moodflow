from fastapi import Depends

from app.auth.security import get_current_user
from app.models.user_models import User


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user
