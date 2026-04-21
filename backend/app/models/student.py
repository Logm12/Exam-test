from sqlalchemy import Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .user import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    # Optional one-to-one link to a User account
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=True, index=True)

    # Required fields per spec
    stt = Column(Integer, nullable=True, index=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    class_name = Column(String, nullable=True)
    mssv = Column(String, unique=True, index=True, nullable=True)
    school = Column(String, nullable=True)
    cccd = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    lien_chi_doan = Column(String, nullable=True)
    team_name = Column(String, nullable=True)

    user = relationship("User", back_populates="student_profile")
