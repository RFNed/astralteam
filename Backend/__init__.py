import os, aiomysql
import sys
import random
from fastapi import Depends, HTTPException, FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from Backend.Modules.Logger import Logger

# Routes
from Backend.Routes.User import router as register_router

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

is_debug = os.getenv("DEBUG") == "True"

logger = Logger("Backend")

load_dotenv()


DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST"),
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD"),
    "db": os.getenv("MYSQL_DATABASE"),
    "port": int(os.getenv("MYSQL_PORT", 3306)),
    "charset": os.getenv("MYSQL_CHARSET", "utf8mb4"),
    "autocommit": True,
    "minsize": int(os.getenv("MYSQL_POOL_SIZE_MIN", 10)),
    "maxsize": int(os.getenv("MYSQL_POOL_SIZE_MAX", 20))
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        app.state.db_pool = await aiomysql.create_pool(**DB_CONFIG)
        async with app.state.db_pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute("SELECT 1")
                result = await cursor.fetchone()
                if result is None:
                    raise RuntimeError("Oh-oh, database is not responding correctly.")
                else:
                    logger.info("Database connection established successfully.")

    except Exception:
        msg = ("Oops, something went wrong while connecting to the database..." if random.random() < 0.2 else "Well, that was toasty... Your DB connection failed. Please check your configuration and try again.")
        logger.fatal(msg)
        if hasattr(app.state, "db_pool") and app.state.db_pool:
            app.state.db_pool.close()
            await app.state.db_pool.wait_closed()
        os._exit(1)
    yield
    if hasattr(app.state, "db_pool") and app.state.db_pool:
        app.state.db_pool.close()
        await app.state.db_pool.wait_closed()


app = FastAPI(lifespan=lifespan, debug=is_debug, title="Backend Astral API", description="Backend API for Astral application", version="0.1.0", docs_url="/docs" if os.getenv("DEBUG") == "True" else None, redoc_url=None)
app.include_router(register_router)