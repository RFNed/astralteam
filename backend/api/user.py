from backend.api.dependencies import UserDependencies
from backend.schemas.user import UserRegister, UserVerify, UserAuth
from backend.services.user import UserService

from fastapi.routing import APIRouter
from fastapi import Depends, Response, Request, HTTPException, status

router = APIRouter(tags=["User"], prefix="/user")

@router.post("/register")
async def register_user(data: UserRegister, service: UserService = Depends(UserDependencies.get_user_service)):
    return await service.register(data)

@router.post("/verify-email")
async def verify_user(data: UserVerify, service: UserService = Depends(UserDependencies.get_user_service)):
    return await service.verify_email(data)

@router.post("/auth")
async def auth_user(data: UserAuth, response: Response, service: UserService = Depends(UserDependencies.get_user_service)):
    result = await service.auth(data)
    response.set_cookie(
        key="session_id",
        value=result["session_id"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 30
    )
    return {"detail": result["detail"]}

@router.get("/me")
async def parse_by_session(request: Request, service: UserService = Depends(UserDependencies.get_user_service)):
    data = request.cookies.get("session_id")
    print(data)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "NOT_EXISTS_SESSION", "message": "Not exists session"})
    return await service.parse_user_by_session_id(data)