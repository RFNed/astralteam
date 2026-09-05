import os, aiomysql, sys, random, aiofiles, redis, re
import aiofiles
from fastapi import Depends, HTTPException, FastAPI, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.core.logger import Logger
from backend.core.email import EmailService
from backend.core.config import settings
# API
from backend.api.user import router as register_router


####### On Windows ##########

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

#######-----++-----##########

logger = Logger("Backend")

test_email = EmailService(
    hostname=settings.VERIFY_HOSTNAME,
    username=settings.VERIFY_USERNAME,
    port=settings.VERIFY_PORT,
    password=settings.VERIFY_PASSWORD
)

IS_DEBUG = settings.DEBUG == "True"

CORS_ORIGINS = [
    origin.strip()
    for origin in list(str(settings.CORS_ORIGINS).split(","))
]

DB_NAME = settings.MYSQL_DATABASE

if not re.fullmatch(r"[A-Za-z0-9_]+", DB_NAME):
    raise ValueError("Error name")

DB_CONFIG = {
    "host": settings.MYSQL_HOST,
    "user": settings.MYSQL_USER,
    "password": settings.MYSQL_PASSWORD,
    "port": settings.MYSQL_PORT,
    "charset": settings.MYSQL_CHARSET,
    "autocommit": True,
    "minsize": settings.MYSQL_POOL_SIZE_MIN,
    "maxsize": settings.MYSQL_POOL_SIZE_MAX,
    "db": settings.MYSQL_DATABASE
}

REDIS_CONFIG = {
    "host": settings.REDIS_HOST,
    "username": settings.REDIS_USER,
    "password": settings.REDIS_PASSWORD,
    "port": settings.REDIS_PORT,
    "db": settings.REDIS_DATABASE,
    "max_connections": settings.REDIS_MAX_CONNECTIONS
}

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Redis
    conn_redis = None
    try:
        conn_redis = await redis.asyncio.Redis(**REDIS_CONFIG, decode_responses=True)
        await conn_redis.ping()
    except:
        logger.fatal("Redis is not launched")
        os._exit(1)

    if IS_DEBUG:
        logger.hint("Redis connected")

    # MySQL
    conn = None
    try:
        conn = await aiomysql.connect(host=DB_CONFIG["host"], user=DB_CONFIG["user"], 
                                      password=DB_CONFIG["password"], db=None, charset=DB_CONFIG["charset"], port=DB_CONFIG["port"])
        try:
            async with conn.cursor() as cursor:
                await cursor.execute('select schema_name from information_schema.schemata where schema_name = %s', (DB_NAME,))
                result = await cursor.fetchone() is not None
                if not result:
                    await cursor.execute(f"CREATE DATABASE {DB_NAME}")
                    async with aiofiles.open("backend/resource/database/structure/database.sql") as sql_database:
                        await cursor.execute(await sql_database.read())
                        logger.info("Database is inited, dont change anything!")
        except Exception as e:
            print(e)

        conn.close()

        if IS_DEBUG:
            logger.hint("Database is checked, creating pool!")

        app.state.db_pool = await aiomysql.create_pool(**DB_CONFIG)
        app.state.redis = await redis.asyncio.Redis(**REDIS_CONFIG)

        if IS_DEBUG:
            logger.hint("Database and Redis pool, is created")

    # Cant connected MySQL
    except Exception as error:
        logger.fatal(f"Oops, something went wrong while connecting to the database..." if random.random() < 0.2 else "Well, that was toasty... Your DB connection failed. Please check your configuration and try again.")
        try:
            if not conn.closed:
                await conn.close()
        except:
            pass
        os._exit(1)

    yield

    if hasattr(app.state, "db_pool") and app.state.db_pool:
        app.state.db_pool.close()
        await app.state.db_pool.wait_closed()

    if hasattr(app.state, "redis") and app.state.redis:
        await app.state.redis.close()

    if IS_DEBUG:
        if getattr(app.state, "db_pool", None) is not None:
            logger.info("Database pool is disconnected!")
        if getattr(app.state, "redis", None) is not None:
            logger.info("Redis is disconnected!")
        logger.hint("Bye-bye!")
    os._exit(0)



app = FastAPI(lifespan=lifespan, debug=IS_DEBUG, title="Backend Astral API", description="Backend API for Astral application", version="0.5.9", docs_url="/docs" if settings.DEBUG == "True" else None, redoc_url=None)

app.mount("/assets", StaticFiles(directory="backend/public"), name="public files")

app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(register_router)

@app.get("/emailtest")
async def test():
    if IS_DEBUG:
        try:
            async with aiofiles.open("backend/resource/email/example_mail.html", "r") as html:
                content = await html.read()
                await test_email.send(settings.DEBUG_MAIL, "Test email", "Click here to watch", content)
            return {"detail": {"code": "TEST_CORRECT", "message": "Email message is sended"}}
        except Exception as error:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"code": "ERROR_TEST_MAIL", "message": f"{error}"})
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")