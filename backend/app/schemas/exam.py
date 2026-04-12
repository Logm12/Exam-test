from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

HEX_COLOR_REGEX = r"^#(?:[0-9a-fA-F]{3}){1,2}$"

class ThemeConfig(BaseModel):
    primary_color: str = Field(pattern=HEX_COLOR_REGEX, default="#000000")
    surface_color: str = Field(pattern=HEX_COLOR_REGEX, default="#ffffff")
    font_family: str = Field(default="Space Grotesk")
    background_url: Optional[str] = None

# Shared properties
class ExamBase(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    duration: int
    is_published: Optional[bool] = False
    start_time: datetime
    end_time: Optional[datetime] = None
    theme_config: Optional[ThemeConfig] = None
<<<<<<< HEAD
    landing_config: Optional[dict] = None
=======
    cover_image: Optional[str] = None
>>>>>>> 682b9fa2abaf4464adc8bfe74aad9ef679313257

# Properties to create
class ExamCreate(ExamBase):
    pass

# Properties to update — ALL fields are optional so partial updates work
class ExamUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    duration: Optional[int] = None
    is_published: Optional[bool] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    theme_config: Optional[ThemeConfig] = None
    landing_config: Optional[dict] = None

class ExamInDBBase(ExamBase):
    id: int
    slug: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Exam(ExamInDBBase):
    pass


class ExamPublic(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    slug: Optional[str] = None
    cover_image: Optional[str] = None
    duration: int
    start_time: datetime
    created_at: datetime
    is_published: bool
    question_count: int
    participants: int
