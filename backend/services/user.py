from backend.repositories.user import UserRepository
from backend.core.security import password_hasher
from backend.core.email import EmailService
from backend.schemas.user import UserRegister

from email_validator import validate_email, EmailNotValidError
from fastapi import HTTPException, status
from secrets import token_hex

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

        return {"detail": {"code": "SUCCESS","message": "Registration is successful, check your email for verification"}}