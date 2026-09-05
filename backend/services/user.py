import json
from backend.repositories.user import UserRepository
from backend.core.security import password_hasher
from backend.core.email import EmailService
from backend.schemas.user import UserRegister, UserVerify, UserAuth

from email_validator import validate_email, EmailNotValidError
from fastapi import HTTPException, status, Response
from secrets import token_hex, token_urlsafe

class UserService:
    def __init__(self, repository: UserRepository, redis, email: EmailService):
        self.repository = repository
        self.redis = redis
        self.email = email

    async def register(self, data: UserRegister):
        if not data.username or not data.email or not data.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "REGDATA_REQUIRED",
                    "message": "Data required for registration",
                },
            )
        if len(data.username) <= 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "INCORRECT_USERNAME_LENGTH",
                    "message": "Username must be more than 6 characters",
                },
            )
        if len(data.password) <= 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "INCORRECT_PASSWORD_LENGTH",
                    "message": "Password must be more than 6 characters",
                },
            )

        if not data.username.isascii() or not data.password.isascii():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "INCORRECT_ASCII_PASSWORD_USERNAME",
                    "message": "Password and username must be ASCII",
                },
            )
        try:
            validate_email(data.email)
        except EmailNotValidError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "INVALID_EMAIL",
                    "message": "Invalid email",
                },
            )
        
        exists = await self.repository.check_account_exists(
            username=data.username,
            email=data.email,
        )
        if exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "USERNAME_TAKEN",
                    "message": "Username or email is already taken",
                },
            )

        password_hash = password_hasher.hash(data.password)
        await self.repository.create_user(
            username=data.username,
            email=data.email,
            password_hash=password_hash,
        )

        verification_token = token_hex(32)
        await self.redis.set(
            f"verify_email:{verification_token}",
            data.email,
            ex=3600,
        )
        await self.email.send_verification_email(to=data.email, token=verification_token)
        return {"detail": {"code": "SUCCESS", 
                           "message": "Registration is successful, check your email for verification"}}

    async def verify_email(self, data: UserVerify):
        result = await self.redis.get(f"verify_email:{data.token}")
        if result is not None:
            await self.repository.verify_user_email(result)
            await self.redis.delete(f"verify_email:{data.token}")
            return {
                "detail": {
                    "code": "SUCCESS",
                    "message": "Verify email is success!"
                }
            }
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": "INVALID_TOKEN", "message": "Token not exists"})

    async def auth(self, data: UserAuth):
        user = await self.repository.auth(data.username)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "ACCOUNT_NOT_EXISTS", "message": "Account not exists, or not verified"})

        try:
            password_hasher.verify(user["password_hash"], data.password)
        except:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "INCORRECT_PASS", "message": "Incorrect password"})
        
        session_id = token_urlsafe(32)
        await self.redis.set(
                f"session:{session_id}",
                user["id"],
                ex=60 * 60 * 24 * 30
            )
        
        return {
            "session_id": session_id,
            "detail": {
                "code": "SUCCESS",
                "message": "Auth is succeed"
            }
        }

    async def parse_user_by_session_id(self, data: str):
        id_user = await self.redis.get(f"session:{data}")
        if not id_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "INVALID_SESSION", "message": "Invalid session id"})

        result = await self.repository.parse_user(id_user)
        result["avatar_url"] = json.loads(result["avatar_url"])
        return {
            "code": "SUCCESS", 
            "message": "Parsed successfully", 
            "data": {
                "id": result["id"],
                "username": result["username"],
                "avatar_url": result["avatar_url"],
                "email": result["email"]
            }
        }
