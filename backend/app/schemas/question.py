from pydantic import BaseModel
from typing import Optional, Dict

# Shared properties
class QuestionBase(BaseModel):
    content: str
    type: str # multiple_choice, short_answer
    options: Optional[Dict[str, str]] = None
    correct_answer: str

# Properties to create
class QuestionCreate(QuestionBase):
    exam_id: int

# Properties to update
class QuestionUpdate(QuestionBase):
    content: Optional[str] = None
    type: Optional[str] = None
    correct_answer: Optional[str] = None

class QuestionInDBBase(QuestionBase):
    id: int
    exam_id: int

    class Config:
        from_attributes = True

class Question(QuestionInDBBase):
    pass
