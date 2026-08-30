from Backend.Modules.Database.Query.User import User
from Backend.Modules.Database import get_db
from Backend.Modules.Email import EmailService

from fastapi.routing import APIRouter
from fastapi import HTTPException, Depends, status

from os import getenv
from dotenv import load_dotenv
from argon2 import PasswordHasher
from pydantic import BaseModel
from email_validator import validate_email
import aiofiles

router = APIRouter(tags=["User"], prefix="/user")

load_dotenv()

IS_DEBUG = getenv("DEBUG") == "True"
EMAIL_CONFIG = {
    "hostname": getenv("VERIFY_HOSTNAME"),
    "username": getenv("VERIFY_USERNAME"),
    "port": int(getenv("VERIFY_PORT")),
    "password": getenv("VERIFY_PASSWORD")
}

verify_email = EmailService(**EMAIL_CONFIG)
password_hasher = PasswordHasher()

class RegisterUserRequest(BaseModel):
    username: str
    email: str
    password: str

@router.get("/emailtest")
async def test():
    if IS_DEBUG:
        try:
            async with aiofiles.open("Backend/Modules/Email/example_mail.html", "r") as html:
                content = await html.read()
                await verify_email.send(getenv("DEBUG_MAIL"), "Test email", "Click here to watch", content)
            return {"detail": {"code": "TEST_CORRECT", "message": "Email message is sended"}}
        except Exception as error:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"code": "ERROR_TEST_MAIL", "message": f"{error}"})
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")

@router.post("/register")
async def register_user(request: RegisterUserRequest, db = Depends(get_db)):

    if request.username == "" or request.email == "" or request.password == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "REGDATA_REQUIRED", "message": "Data requried for registration"})

    if not(len(request.username) > 6):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INCORRECT_USERNAME_LENGTH", "message": "Username must be more 6 characters"})

    if not(len(request.password) > 6):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INCORRECT_PASSWORD_LENGTH", "message": "Password must be more 6 characters"})

    if not(request.password.isascii()) or not(request.username.isascii()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INCORRECT_ASCII_PASSWORD_USERNAME", "message": "Password and Login must be ascii"})

    try:
        validate_email(request.email)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INVALID_EMAIL", "message": "Invalid email"})
    
    await db.execute(User.CHECK_ACCOUNT_EXISTS_QUERY, (request.username, request.email))
    result = await db.fetchone()

    if result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "USERNAME_TAKEN", "message": "Invalid email"})

    password_hash = password_hasher.hash(request.password)

    await db.execute(User.REGISTER_QUERY, (request.username, request.email, password_hash))

    return {"detail": {"code": "SUCCESS", "message": "Registartion is success"}}