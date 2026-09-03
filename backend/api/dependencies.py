from backend.core.email import EmailService
from backend.core.database import get_db
from backend.core.redis import get_redis
from backend.repositories.user import UserRepository
from backend.services.user import UserService

from os import getenv
from dotenv import load_dotenv
from fastapi import Depends

load_dotenv()


def get_email_service():
    return EmailService(
        hostname=getenv("VERIFY_HOSTNAME"),
        username=getenv("VERIFY_USERNAME"),
        port=int(getenv("VERIFY_PORT")),
        password=getenv("VERIFY_PASSWORD"),
    )


def get_user_repository(
    db=Depends(get_db),
) -> UserRepository:
    return UserRepository(db)


def get_user_service(
    repository: UserRepository = Depends(get_user_repository),
    redis=Depends(get_redis),
    email: EmailService = Depends(get_email_service),
) -> UserService:
    return UserService(
        repository=repository,
        redis=redis,
        email=email,
    )