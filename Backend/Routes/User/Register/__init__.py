from fastapi.routing import APIRouter
from fastapi import HTTPException, Depends

from Backend.Modules.Database.Query.User import User
from Backend.Modules.Database import get_db

router = APIRouter(tags=["User"], prefix="/user/register")