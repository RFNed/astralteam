from pydantic import BaseModel, Field, EmailStr
from typing import Annotated

Username = Annotated[str, Field(min_length=5)]
Password = Annotated[str, Field(min_length=7)]

class UserCredentials(BaseModel):
    username: str
    password: str

class UserRegister(UserCredentials):
    username: Username
    password: Password
    email: EmailStr

class UserVerify(BaseModel):
    token: str