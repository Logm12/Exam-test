from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.organization import OrganizationalUnit
from app.schemas.organization import OrganizationalUnit as OrgSchema, OrganizationalUnitCreate, OrganizationalUnitUpdate

router = APIRouter()

@router.get("/", response_model=List[OrgSchema])
async def read_organizations(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    result = await db.execute(select(OrganizationalUnit).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=OrgSchema)
async def create_organization(
    *,
    db: AsyncSession = Depends(get_db),
    org_in: OrganizationalUnitCreate,
) -> Any:
    org = OrganizationalUnit(**org_in.model_dump())
    db.add(org)
    await db.commit()
    await db.refresh(org)
    return org

@router.delete("/{org_id}")
async def delete_organization(
    *,
    db: AsyncSession = Depends(get_db),
    org_id: int,
) -> Any:
    result = await db.execute(select(OrganizationalUnit).where(OrganizationalUnit.id == org_id))
    org = result.scalars().first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    await db.delete(org)
    await db.commit()
    return {"ok": True}
