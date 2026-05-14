from config import config
from fastapi import FastAPI

app = FastAPI(docs_url=("/docs" if config.is_debug == "True" else None))