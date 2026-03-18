from pydantic import BaseModel
from typing import Dict

class AnswerDraft(BaseModel):
    answers: Dict[str, str] # { question_id: option_or_text }

class ExamSubmit(BaseModel):
    answers: Dict[str, str]
    forced_submit: bool = False
    violation_count: int = 0
    time_spent_seconds: int | None = None
