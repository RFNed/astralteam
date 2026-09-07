from fastapi.routing import APIRouter
from fastapi import Request, Depends, HTTPException
from backend.api.dependencies import BalanceDependecies
from backend.services.balance import BalanceService
from backend.schemas.balance import YooMoneyNotification

router = APIRouter(tags=["Balance"], prefix="/balance")

@router.get("/create-invoice")
async def create_invoice(amount: int, request: Request, service: BalanceService = Depends(BalanceDependecies.get_balance_service)):
    print(request.cookies.get("session_id"))
    return await service.create_invoice(request.cookies.get("session_id"), amount)

@router.post("/webhook-yoomoney")
async def webhook_yoomoney(request: Request):
    try:
        form = await request.form()
        data = YooMoneyNotification(**dict(form))
        print(data)
        return {"status": "ok"}
    except:
        raise HTTPException(status_code=401)