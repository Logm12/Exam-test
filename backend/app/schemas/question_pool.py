from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class QuestionPoolBase(BaseModel):
    name: str
    description: Optional[str] = None
    org_unit_id: Optional[int] = None

class QuestionPoolCreate(QuestionPoolBase):
    pass

class QuestionPoolUpdate(QuestionPoolBase):
    name: Optional[str] = None

class QuestionPoolInDBBase(QuestionPoolBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuestionPool(QuestionPoolInDBBase):
    pass
