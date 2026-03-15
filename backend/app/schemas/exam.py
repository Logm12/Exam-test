from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import Optional, Any
from datetime import datetime

HEX_COLOR_REGEX = r"^#(?:[0-9a-fA-F]{3}){1,2}$"

class ThemeConfig(BaseModel):
    primary_color: str = Field(pattern=HEX_COLOR_REGEX, default="#000000")
    surface_color: str = Field(pattern=HEX_COLOR_REGEX, default="#ffffff")
    font_family: str = Field(default="Space Grotesk")
    background_url: Optional[HttpUrl] = None

# Shared properties
class ExamBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration: int
    is_published: Optional[bool] = False
    start_time: datetime
    theme_config: Optional[ThemeConfig] = None
    cover_image: Optional[str] = None

# Properties to create
class ExamCreate(ExamBase):
    pass

# Properties to update
class ExamUpdate(ExamBase):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    start_time: Optional[datetime] = None

class ExamInDBBase(ExamBase):
    id: int
    slug: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Exam(ExamInDBBase):
    pass

