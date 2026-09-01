from Backend.Modules.Database.Query.User import User
from Backend.Modules.Database import get_db
from Backend.Modules.Email import EmailService, parse_template
from Backend.Modules.Redis import get_redis

from fastapi.routing import APIRouter
from fastapi import HTTPException, Depends, status

from os import getenv
from dotenv import load_dotenv
from argon2 import PasswordHasher
from pydantic import BaseModel
from email_validator import validate_email
from secrets import token_hex

router = APIRouter(tags=["User"], prefix="/user")

load_dotenv()

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

@router.post("/register")
async def register_user(request: RegisterUserRequest, db = Depends(get_db), redis = Depends(get_redis)):

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
    

    verification_token = token_hex(32)
    await redis.set(f"verify_email:{verification_token}", request.email, ex=3600)


    HTML_content = await parse_template(template_html="Backend/Modules/Email/template_mail.html", image_path="https://raw.githubusercontent.com/RFNed/astralteam/main/Frontend/public/pics/astralcat.png", link=f"{getenv('FRONTEND_URL')}/verify-email?token={verification_token}")
    await verify_email.send(
        to=request.email,
        subject="Verify your email",
        simple_content="Подтверждение аккаунта",
        HTML_content=HTML_content
    )

    return {"detail": {"code": "SUCCESS", "message": "Registration is success, check your email for verification"}}