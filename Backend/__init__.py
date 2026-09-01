import os, aiomysql, sys, random, aiofiles, redis, re
from fastapi import Depends, HTTPException, FastAPI, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import aiofiles

from Backend.Modules.Logger import Logger
from Backend.Modules.Email import EmailService
# Routes
from Backend.Routes.User import router as register_router


####### On Windows ##########

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

#######-----++-----##########

logger = Logger("Backend")

load_dotenv()

test_email = EmailService(
    hostname=os.getenv("VERIFY_HOSTNAME"),
    username=os.getenv("VERIFY_USERNAME"),
    port=int(os.getenv("VERIFY_PORT")),
    password=os.getenv("VERIFY_PASSWORD")
)

is_debug = os.getenv("DEBUG") == "True"

CORS_ORIGINS = [
    origin.strip()
    for origin in list(str(os.getenv("CORS_ORIGINS")).split(","))
]

DB_NAME = os.getenv("MYSQL_DATABASE", "astralteam")

if not re.fullmatch(r"[A-Za-z0-9_]+", DB_NAME):
    raise ValueError("Error name")

DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "localhost"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "port": int(os.getenv("MYSQL_PORT", 3306)),
    "charset": os.getenv("MYSQL_CHARSET", "utf8mb4"),
    "autocommit": True,
    "minsize": int(os.getenv("MYSQL_POOL_SIZE_MIN", 10)),
    "maxsize": int(os.getenv("MYSQL_POOL_SIZE_MAX", 20)),
    "db": os.getenv("MYSQL_DATABASE")
}

REDIS_CONFIG = {
    "host": os.getenv("REDIS_HOST", "localhost"),
    "username": os.getenv("REDIS_USER", "default"),
    "password": os.getenv("REDIS_PASSWORD", ""),
    "port": os.getenv("REDIS_PORT", 6379),
    "db": int(os.getenv("REDIS_DATABASE", 0)),
    "max_connections": int(os.getenv("REDIS_MAX_CONNECTIONS", 50))
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

    if is_debug:
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
                    async with aiofiles.open("Backend/Modules/Database/Structure/DATABASE.sql") as sql_database:
                        await cursor.execute(await sql_database.read())
                        logger.info("Database is inited, dont change anything!")
        except Exception as e:
            print(e)

        conn.close()

        if is_debug:
            logger.hint("Database is checked, creating pool!")

        app.state.db_pool = await aiomysql.create_pool(**DB_CONFIG)
        app.state.redis = await redis.asyncio.Redis(**REDIS_CONFIG)

        if is_debug:
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

    if is_debug:
        if getattr(app.state, "db_pool", None) is not None:
            logger.info("Database pool is disconnected!")
        if getattr(app.state, "redis", None) is not None:
            logger.info("Redis is disconnected!")
        logger.hint("Bye-bye!")
    os._exit(0)



app = FastAPI(lifespan=lifespan, debug=is_debug, title="Backend Astral API", description="Backend API for Astral application", version="0.5.5b", docs_url="/docs" if os.getenv("DEBUG") == "True" else None, redoc_url=None)
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.mount("/download/installer", StaticFiles(directory="Backend/Download/Installer"), name="download_dir")
app.mount("/resource", StaticFiles(directory="Backend/Resource"), name="resource_dir")
app.include_router(register_router)

@app.get("/emailtest")
async def test():
    if IS_DEBUG:
        try:
            async with aiofiles.open("Backend/Modules/Email/example_mail.html", "r") as html:
                content = await html.read()
                await test_email.send(os.getenv("DEBUG_MAIL"), "Test email", "Click here to watch", content)
            return {"detail": {"code": "TEST_CORRECT", "message": "Email message is sended"}}
        except Exception as error:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"code": "ERROR_TEST_MAIL", "message": f"{error}"})
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")