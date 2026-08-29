from fastapi.routing import APIRouter
from fastapi import HTTPException, Depends, status
from pydantic import BaseModel
from email_validator import validate_email
from Backend.Modules.Database.Query.User import User
from Backend.Modules.Database import get_db

router = APIRouter(tags=["User"], prefix="/user")

class RegisterUserRequest(BaseModel):
    username: str
    email: str
    password: str

@router.post("/register")
async def register_user(request: RegisterUserRequest, db = Depends(get_db)):

    if request.username == "" or request.email == "" or request.password == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "REGDATA_REQUIRED", "message": "Data requried for registration"})

    if not(len(request.username) > 6):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INCORRECT_USERNAME_LENGTH", "message": "Username must be more 6 characters"})

    if not(len(request.password) > 6):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INCORRECT_PASSWORD_LENGTH", "message": "Password must be more 6 characters"})
    
    try:
        validate_email(request.email)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INVALID_EMAIL", "message": "Invalid email"})
    
    await db.execute(User.CHECK_ACCOUNT_EXISTS_QUERY, (request.username, request.email))
    result = await db.fetchone()

    if result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "USERNAME_TAKEN", "message": "Invalid email"})
    
    await db.execute(User.REGISTER_QUERY, (request.username, request.email, request.password))

    return {"detail": {"code": "SUCCESS", "message": "Registartion is success"}}