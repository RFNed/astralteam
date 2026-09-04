from pydantic import BaseModel

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserAuth(BaseModel):
    username: str
    password: str

class UserVerify(BaseModel):
    token: str