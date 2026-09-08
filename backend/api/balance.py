from fastapi.routing import APIRouter
from fastapi import Request, Depends, HTTPException, status

from aioyookassa.core.webhook_handler import WebhookHandler
from aioyookassa.types.enum import WebhookEvent
from aioyookassa.types.payment import Payment

from backend.api.dependencies import BalanceDependecies
from backend.services.balance import BalanceService
from backend.core.config import settings


router = APIRouter(tags=["Balance"], prefix="/balance")

handler = WebhookHandler()

@router.get("/create-invoice")
async def create_invoice(amount: int, request: Request, service: BalanceService = Depends(BalanceDependecies.get_balance_service)):
    if amount < 100:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "code": "INVALID_AMOUNT",
            "message": "Invalid amount, it must be more 100"
        })
    if settings.DEBUG:
        print(request.cookies.get("session_id"))
    return await service.create_invoice(request.cookies.get("session_id"), amount, "Пополнение счета")

@router.post("/webhooks/yookassa")
async def yookassa_webhook(request: Request, service: BalanceService = Depends(BalanceDependecies.get_balance_service)):

    if not handler.validator.is_allowed(request.client.host):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
            "code": "HANDLER_IS_NOT_ALLOWED",
            "message": "Handler is not allowed"
        })

    data = await request.json()
    notification = handler.parse_notification(data, request.cookies.get("session_id"), service)
    await handler.handle_notification(notification)

    return {"detail": {"code": "OK", "message": "Done"}}

@handler.register_callback(WebhookEvent.PAYMENT_SUCCEEDED)
async def payment_succeeded(payment: Payment, session_id: str, service):
    return

@handler.register_callback(WebhookEvent.PAYMENT_CANCELED)
async def payment_canceled(payment: Payment, session_id: str, service):
    return