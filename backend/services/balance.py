from backend.repositories.balance import BalanceRepository
from backend.core.config import settings
from fastapi import HTTPException, status 
from secrets import token_urlsafe

class BalanceService:
    def __init__(self, repository: BalanceRepository, redis):
        self.repository = repository
        self.redis = redis

    async def create_invoice(self, session_id: str, amount: int):

        token = token_urlsafe(16)
        return {
            "detail": {
                "code": "OK",
            }
        }