from aioyookassa import YooKassa
from fastapi import Request

async def get_yookasssa(request: Request) -> YooKassa:
    return request.app.state.yookassa