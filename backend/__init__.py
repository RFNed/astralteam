from config import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(docs_url=("/docs" if config.is_debug == "True" else None))
app.add_middleware(CORSMiddleware, allow_origins=[f'{config.frontend_url}'])


@app.get("/socials")
async def socials_get():
    return {"github": config.github, "ts": config.teamspeak, "matrix": config.matrix, "discord": config.discord}

