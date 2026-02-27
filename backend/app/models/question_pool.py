from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user import Base

class QuestionPool(Base):
    __tablename__ = "question_pools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    org_unit_id = Column(Integer, ForeignKey("organizational_units.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    org_unit = relationship("OrganizationalUnit")
    questions = relationship("Question", back_populates="pool")
