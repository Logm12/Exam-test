import pytest
from pydantic import ValidationError
from app.schemas.exam import ThemeConfig, ExamCreate
from datetime import datetime

def test_theme_config_valid():
    config = ThemeConfig(
        primary_color="#FFAA00",
        surface_color="#123",
        font_family="Space Grotesk"
    )
    assert config.primary_color == "#FFAA00"
    assert config.surface_color == "#123"

def test_theme_config_invalid_hex():
    with pytest.raises(ValidationError):
        ThemeConfig(primary_color="invalid-color")
        
def test_theme_config_invalid_url():
    with pytest.raises(ValidationError):
        ThemeConfig(background_url="not-a-url")

def test_exam_create_with_theme():
    exam = ExamCreate(
        title="Test Exam",
        duration=60,
        start_time=datetime.now(),
        theme_config={
            "primary_color": "#000000",
            "surface_color": "#ffffff"
        }
    )
    assert exam.theme_config.primary_color == "#000000"
    assert exam.theme_config.surface_color == "#ffffff"
    assert exam.theme_config.font_family == "Space Grotesk"  # Default
