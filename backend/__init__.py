from config import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(docs_url=("/docs" if config.is_debug == "True" else None))
app.add_middleware(CORSMiddleware, allow_origins=['http://127.0.0.6:5173'])


@app.get("/socials")
async def socials_get():
    return {"github": config.github}