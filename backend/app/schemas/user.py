from pydantic import BaseModel
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    username: str
    role: Optional[str] = "student"

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: int

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    pass
    
# Properties properties stored in DB
class UserInDB(UserInDBBase):
    password_hash: str
