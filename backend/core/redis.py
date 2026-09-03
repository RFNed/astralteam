import redis.asyncio as redis

from collections.abc import AsyncGenerator
from fastapi import Request

async def get_redis(request: Request) -> redis.Redis:
    return request.app.state.redis