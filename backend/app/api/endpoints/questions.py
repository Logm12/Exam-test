from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.exam import Question
from app.schemas.question import Question as QuestionSchema, QuestionCreate, QuestionUpdate

router = APIRouter()

@router.get("/exam/{exam_id}", response_model=List[QuestionSchema])
async def read_questions_by_exam(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
) -> Any:
    result = await db.execute(select(Question).where(Question.exam_id == exam_id))
    questions = result.scalars().all()
    return questions

@router.post("/", response_model=QuestionSchema)
async def create_question(
    *,
    db: AsyncSession = Depends(get_db),
    question_in: QuestionCreate,
) -> Any:
    question = Question(
        exam_id=question_in.exam_id,
        content=question_in.content,
        type=question_in.type,
        options=question_in.options,
        correct_answer=question_in.correct_answer
    )
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question

@router.put("/{question_id}", response_model=QuestionSchema)
async def update_question(
    *,
    db: AsyncSession = Depends(get_db),
    question_id: int,
    question_in: QuestionUpdate,
) -> Any:
    result = await db.execute(select(Question).where(Question.id == question_id))
    question = result.scalars().first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    update_data = question_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)
        
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question

@router.delete("/{question_id}")
async def delete_question(
    *,
    db: AsyncSession = Depends(get_db),
    question_id: int,
) -> Any:
    result = await db.execute(select(Question).where(Question.id == question_id))
    question = result.scalars().first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    await db.delete(question)
    await db.commit()
    return {"ok": True}
