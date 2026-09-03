from backend.api.dependencies import get_user_service
from backend.schemas.user import UserRegister
from backend.services.user import UserService

from fastapi.routing import APIRouter
from fastapi import Depends

router = APIRouter(tags=["User"], prefix="/user")

@router.post("/register")
async def register_user(
    data: UserRegister,
    service: UserService = Depends(get_user_service)
):
    return await service.register(data)