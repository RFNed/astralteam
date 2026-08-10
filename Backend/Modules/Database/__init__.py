from fastapi import Request
import aiomysql

async def get_db(request: Request):
    pool: aiomysql.Pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            yield cursor