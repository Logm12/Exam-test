from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student") # admin, student
    org_unit_id = Column(Integer, ForeignKey("organizational_units.id", ondelete="SET NULL"), nullable=True)
    
    org_unit = relationship("OrganizationalUnit", back_populates="users")
    submissions = relationship("Submission", back_populates="user")

    student_profile = relationship(
        "Student",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
