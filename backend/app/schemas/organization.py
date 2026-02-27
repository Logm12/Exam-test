from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class OrganizationalUnitBase(BaseModel):
    name: str
    description: Optional[str] = None

class OrganizationalUnitCreate(OrganizationalUnitBase):
    pass

class OrganizationalUnitUpdate(OrganizationalUnitBase):
    name: Optional[str] = None

class OrganizationalUnitInDBBase(OrganizationalUnitBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrganizationalUnit(OrganizationalUnitInDBBase):
    pass
