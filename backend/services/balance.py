from backend.repositories.balance import BalanceRepository
from backend.core.config import settings

from aioyookassa import YooKassa
from aioyookassa.types.params import CreatePaymentParams
from aioyookassa.types.payment import Money, Confirmation
from aioyookassa.types.enum import Currency, ConfirmationType

from fastapi import HTTPException, status 
from secrets import token_urlsafe


class BalanceService:
    def __init__(self, repository: BalanceRepository, yookassa: YooKassa, redis):
        self.repository = repository
        self.redis = redis
        self.yookassa = yookassa

    async def create_invoice(self, session_id: str, amount: int, description: str):
        id_user = await self.redis.get(f"session:{session_id}")
        if id_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "code": "NOT AUTH",
                "message": "Well, look at code"
            })

        if (await self.repository.has_user_payment(id_user)):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={
                "code": "ACTIVE_PAYMENT_EXISTS",
                "message": "An active payment already exists"
            })
        
        params = CreatePaymentParams(
            amount = Money(value=amount, currency=Currency.RUB),
            confirmation = Confirmation(type=ConfirmationType.REDIRECT, return_url="https://astralteam.ru"),
            description = description,
            capture = True,
            metadata = {
                "user": str(id_user)
            }
        )

        payment = await self.yookassa.payments.create_payment(params)

        await self.repository.register_user_payment(id_user, payment.id, str(amount))

        return {
            "detail": {
                "code": "CREATED_SUCCESSFULLY",
                "message": payment.confirmation.url
            }
        }

    async def check_invoice(self, session_id: str):
        id_user = await self.redis.get(f"session:{session_id}")
        if id_user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "code": "NOT_AUTH",
                "message": "Well, look at code"
            })

        