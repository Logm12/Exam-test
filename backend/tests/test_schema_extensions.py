import pytest
from pydantic import ValidationError
from datetime import datetime
from app.schemas.exam import ExamCreate
from app.schemas.student import StudentCreate

def test_exam_landing_config_valid():
    """Test that ExamCreate accepts landing_config and end_time"""
    exam = ExamCreate(
        title="Contest 2026",
        duration=120,
        start_time=datetime.now(),
        end_time=datetime.now(),
        landing_config={
            "poster_image": "/test.png",
            "organizer_name": "VNU",
            "rules": "Be honest",
            "guide": "Click start"
        }
    )
    assert exam.end_time is not None
    assert exam.landing_config is not None
    assert exam.landing_config["organizer_name"] == "VNU"

def test_student_profile_fields_valid():
    """Test that StudentCreate accepts the new profile fields"""
    student = StudentCreate(
        user_id=1,
        full_name="Nguyen Van A",
        date_of_birth=datetime(2000, 1, 1).date(),
        cccd="001080123456",
        address="144 Xuan Thuy",
        phone="0987654321",
        email="test@vnu.edu.vn",
        school="VNU IS",
        mssv="20050001",
        class_name="K65",
        lien_chi_doan="Khoa CNTT"
    )
    assert student.cccd == "001080123456"
    assert student.address == "144 Xuan Thuy"
    assert student.phone == "0987654321"
    assert student.email == "test@vnu.edu.vn"
    assert student.lien_chi_doan == "Khoa CNTT"
