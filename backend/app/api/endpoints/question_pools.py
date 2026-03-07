from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.api.deps import get_current_active_admin
from app.models.user import User
from app.models.question_pool import QuestionPool
from app.schemas.question_pool import QuestionPool as PoolSchema, QuestionPoolCreate

router = APIRouter()

@router.get("/", response_model=List[PoolSchema])
async def read_pools(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    result = await db.execute(select(QuestionPool).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=PoolSchema)
async def create_pool(
    *,
    db: AsyncSession = Depends(get_db),
    pool_in: QuestionPoolCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    pool = QuestionPool(**pool_in.model_dump())
    db.add(pool)
    await db.commit()
    await db.refresh(pool)
    return pool

@router.delete("/{pool_id}")
async def delete_pool(
    *,
    db: AsyncSession = Depends(get_db),
    pool_id: int,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    result = await db.execute(select(QuestionPool).where(QuestionPool.id == pool_id))
    pool = result.scalars().first()
    if not pool:
        raise HTTPException(status_code=404, detail="Question pool not found")
        
    await db.delete(pool)
    await db.commit()
    return {"ok": True}
