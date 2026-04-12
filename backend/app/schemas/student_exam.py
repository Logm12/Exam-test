from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

# Question for student (hidden correct_answer)
class StudentQuestion(BaseModel):
    id: int
    exam_id: int
    content: str
    type: str # multiple_choice, short_answer
    options: Optional[Dict[str, str]] = None
    
    class Config:
        from_attributes = True

class StudentExam(BaseModel):
    id: int
    title: str
    duration: int
    start_time: datetime
    questions: List[StudentQuestion] = []
    
    class Config:
        from_attributes = True
