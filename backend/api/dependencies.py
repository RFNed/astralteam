from backend.core.email import EmailService
from backend.core.database import get_db
from backend.core.redis import get_redis
from backend.repositories.user import UserRepository
from backend.services.user import UserService
from backend.core.config import settings
from dotenv import load_dotenv
from fastapi import Depends


def get_email_service():
    return EmailService(
        hostname=settings.VERIFY_HOSTNAME,
        username=settings.VERIFY_USERNAME,
        port=settings.VERIFY_PORT,
        password=settings.VERIFY_PASSWORD,
    )

class UserDependencies:
    @staticmethod
    def get_user_repository(db=Depends(get_db)) -> UserRepository:
        return UserRepository(db)

    @staticmethod
    def get_user_service(repository: UserRepository = Depends(get_user_repository), redis=Depends(get_redis), email: EmailService = Depends(get_email_service)) -> UserService:
        return UserService(
            repository=repository,
            redis=redis,
            email=email,
        )