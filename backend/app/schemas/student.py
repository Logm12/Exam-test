from datetime import date
from typing import Optional

from pydantic import BaseModel


class StudentBase(BaseModel):
    stt: Optional[int] = None
    full_name: str
    date_of_birth: Optional[date] = None
    class_name: Optional[str] = None
    mssv: Optional[str] = None
    school: Optional[str] = None
    user_id: Optional[int] = None
    cccd: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    lien_chi_doan: Optional[str] = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    stt: Optional[int] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    class_name: Optional[str] = None
    mssv: Optional[str] = None
    school: Optional[str] = None
    user_id: Optional[int] = None
    cccd: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    lien_chi_doan: Optional[str] = None


class Student(StudentBase):
    id: int

    class Config:
        from_attributes = True
