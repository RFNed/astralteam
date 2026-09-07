from backend.repositories.balance import BalanceRepository
from backend.core.config import settings
from fastapi import HTTPException, status 
from secrets import token_urlsafe
from yoomoney import Quickpay

class BalanceService:
    def __init__(self, repository: BalanceRepository, redis):
        self.repository = repository
        self.redis = redis

    async def create_invoice(self, session_id: str, amount: int):

        token = token_urlsafe(16)
        link = Quickpay(
            receiver=settings.PAYMENT_SYSTEM_API_KEY,
            quickpay_form="shop",
            targets="Пополнение кошелька",
            paymentType="SB",
            sum=amount,
            label=token,
            need_email=True
        )
        return {
            "detail": {
                "code": "OK",
                "message": f"{link.redirected_url}"
            }
        }