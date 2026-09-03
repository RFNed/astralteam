import aiomysql

from typing import AsyncGenerator
from fastapi import Request

async def get_db(request: Request) -> AsyncGenerator[aiomysql.DictCursor, None]:
    pool: aiomysql.Pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            yield cursor