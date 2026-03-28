from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user import Base
import secrets


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String(12), unique=True, index=True, nullable=True)
    description = Column(String, nullable=True)
    cover_image = Column(String, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    duration = Column(Integer, nullable=False)  # Duration in minutes
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    theme_config = Column(JSON, nullable=True)
    landing_config = Column(JSON, nullable=True)

    @staticmethod
    def generate_slug() -> str:
        return secrets.token_urlsafe(8)[:10]
    
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="exam", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=True)
    pool_id = Column(Integer, ForeignKey("question_pools.id", ondelete="SET NULL"), nullable=True)
    content = Column(String, nullable=False)
    type = Column(String, nullable=False)  # multiple_choice, short_answer
    options = Column(JSON, nullable=True) # {"A": "Option A", "B": "Option B"}
    correct_answer = Column(String, nullable=False) # e.g., "A" or "Short answer text here"
    
    exam = relationship("Exam", back_populates="questions")
    pool = relationship("QuestionPool", back_populates="questions")
    answers = relationship("Answer", back_populates="question")
