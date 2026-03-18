from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_current_active_admin
from app.db.session import get_db
from app.models.student import Student
from app.models.user import User
from app.schemas.student import Student as StudentSchema
from app.schemas.student import StudentCreate, StudentUpdate


router = APIRouter()


@router.get("/", response_model=List[StudentSchema])
async def list_students(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    _ = current_user
    result = await db.execute(select(Student).offset(skip).limit(limit))
    return result.scalars().all()


@router.post("/", response_model=StudentSchema)
async def create_student(
    *,
    db: AsyncSession = Depends(get_db),
    student_in: StudentCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    _ = current_user

    if student_in.user_id is not None:
        user_res = await db.execute(select(User).where(User.id == student_in.user_id))
        user = user_res.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.role != "student":
            raise HTTPException(status_code=400, detail="User role must be student")
        # Ensure one-to-one
        existing = await db.execute(select(Student).where(Student.user_id == student_in.user_id))
        if existing.scalars().first() is not None:
            raise HTTPException(status_code=400, detail="Student profile already exists for this user")

    student = Student(**student_in.model_dump())
    db.add(student)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Duplicate or invalid student data") from e
    await db.refresh(student)
    return student


@router.get("/{student_id}", response_model=StudentSchema)
async def get_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    _ = current_user
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.put("/{student_id}", response_model=StudentSchema)
async def update_student(
    *,
    student_id: int,
    student_in: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    _ = current_user
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    payload = student_in.model_dump(exclude_unset=True)
    if "user_id" in payload and payload["user_id"] is not None:
        user_res = await db.execute(select(User).where(User.id == payload["user_id"]))
        user = user_res.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.role != "student":
            raise HTTPException(status_code=400, detail="User role must be student")
        # Ensure one-to-one
        existing = await db.execute(
            select(Student).where(Student.user_id == payload["user_id"], Student.id != student_id)
        )
        if existing.scalars().first() is not None:
            raise HTTPException(status_code=400, detail="Student profile already exists for this user")

    for key, value in payload.items():
        setattr(student, key, value)

    db.add(student)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Duplicate or invalid student data") from e
    await db.refresh(student)
    return student


@router.delete("/{student_id}")
async def delete_student(
    *,
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    _ = current_user
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    await db.delete(student)
    await db.commit()
    return {"ok": True}
