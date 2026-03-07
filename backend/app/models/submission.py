from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    score = Column(Float, nullable=True)
    status = Column(String, default="in_progress") # in_progress, submitted, graded
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    violation_count = Column(Integer, default=0)
    forced_submit = Column(String, default="false") # "true" or "false" (SQLite friendly boolean fallback or Boolean if postgres)
    
    user = relationship("User", back_populates="submissions")
    exam = relationship("Exam", back_populates="submissions")
    answers = relationship("Answer", back_populates="submission", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    selected_option = Column(String, nullable=True) # Dành cho trắc nghiệm
    text_response = Column(String, nullable=True) # Dành cho câu hỏi tự luận
    
    submission = relationship("Submission", back_populates="answers")
    question = relationship("Question", back_populates="answers")

    __table_args__ = (
        UniqueConstraint("submission_id", "question_id", name="uix_submission_question"),
    )
