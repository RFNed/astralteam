from fastapi.routing import APIRouter
from fastapi import HTTPException, Depends
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
        raise HTTPException(status_code=400, detail="Username, email, and password are required.")
    try:
        validate_email(request.email)
    except:
        raise HTTPException(status_code=400, detail=f"Invalid email")
    await db.execute(User.CHECK_ACCOUNT_EXISTS_QUERY, (request.username, request.email))
    result = await db.fetchone()
    if result:
        raise HTTPException(status_code=400, detail="Username or email already exists.")
    await db.execute(User.REGISTER_QUERY, (request.username, request.email, request.password))
    return {"detail": "registered successfully"}