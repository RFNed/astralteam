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
        id_user = await self.redis.get(f"session_id:{session_id}")
        if id_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "NOT_AUTH", "message": "Well, look at code..."})

        token = token_urlsafe(16)
        await self.redis.set(f"balance:{token}", id_user)
        link = Quickpay(
            receiver=settings.PAYMENT_SYSTEM_WALLET_ID,
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