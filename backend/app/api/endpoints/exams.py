from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import json
import os
import tempfile
import io

from app.db.session import get_db
from app.db.redis import get_redis
from app.api.deps import get_current_user
from app.models.user import User
from app.models.exam import Exam, Question
from app.models.submission import Submission, Answer
from app.schemas.exam import Exam as ExamSchema, ExamCreate, ExamUpdate
from app.schemas.student_exam import StudentExam
from app.schemas.submission import AnswerDraft, ExamSubmit
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.get("/", response_model=List[ExamSchema])
async def read_exams(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    result = await db.execute(select(Exam).offset(skip).limit(limit))
    exams = result.scalars().all()
    return exams

@router.post("/", response_model=ExamSchema)
async def create_exam(
    *,
    db: AsyncSession = Depends(get_db),
    exam_in: ExamCreate,
) -> Any:
    exam_data = exam_in.model_dump()
    exam_data["slug"] = Exam.generate_slug()
    exam = Exam(**exam_data)
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return exam


@router.post("/import-questions")
async def import_questions_from_file(
    file: UploadFile = File(...),
):
    """
    Upload a .docx or .pdf file (max 10MB) and extract questions.
    Returns a list of parsed questions for review before adding to an exam.
    """
    MAX_SIZE = 10 * 1024 * 1024  # 10 MB
    allowed_types = (".docx", ".pdf")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_types:
        raise HTTPException(status_code=400, detail="Only .docx and .pdf files are supported")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 10MB limit")

    # Write to temp file for parsing
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        from app.core.document_parser import parse_file
        parsed = parse_file(tmp_path)
        return {
            "filename": file.filename,
            "total_questions": len(parsed),
            "questions": [
                {
                    "number": q.number,
                    "content": q.content,
                    "options": q.options,
                    "correct_answer": q.correct_answer,
                    "type": q.type,
                }
                for q in parsed
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse file: {str(e)}")
    finally:
        os.unlink(tmp_path)


@router.get("/by-slug/{slug}")
async def get_exam_by_slug(
    *,
    db: AsyncSession = Depends(get_db),
    slug: str,
) -> Any:
    """
    Public endpoint: get exam info by slug for the per-exam landing page.
    """
    result = await db.execute(select(Exam).where(Exam.slug == slug))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return {
        "id": exam.id,
        "title": exam.title,
        "description": exam.description,
        "slug": exam.slug,
        "start_time": str(exam.start_time),
        "duration": exam.duration,
        "is_published": exam.is_published,
    }

@router.get("/{exam_id}", response_model=ExamSchema)
async def read_exam(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
) -> Any:
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.get("/{exam_id}/student", response_model=StudentExam)
async def get_exam_for_student(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
) -> Any:
    """
    Get exam details with questions for a student (correct answers are hidden).
    """
    result = await db.execute(
        select(Exam).options(selectinload(Exam.questions)).where(Exam.id == exam_id)
    )
    exam = result.scalars().first()
    if not exam or not exam.is_published:
        raise HTTPException(status_code=404, detail="Exam not found or not published")
    return exam

@router.put("/{exam_id}", response_model=ExamSchema)
async def update_exam(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
    exam_in: ExamUpdate,
) -> Any:
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    update_data = exam_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exam, field, value)
        
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return exam

@router.delete("/{exam_id}")
async def delete_exam(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
) -> Any:
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
        
    await db.delete(exam)
    await db.commit()
    return {"ok": True}

# TODO: Re-integrate rate limiting after upgrading fastapi-limiter to pyrate_limiter API
# from fastapi_limiter.depends import RateLimiter

@router.post("/{exam_id}/draft")
async def save_draft(
    *,
    exam_id: int,
    draft_in: AnswerDraft,
    current_user: User = Depends(get_current_user),
    redis_client = Depends(get_redis)
):
    """
    Save answers draft to Redis. Key format: draft:exam_id:user_id
    Strict Rate Limiting: Max 10 drafts per minute to prevent Redis exhaustion.
    """
    key = f"draft:{exam_id}:{current_user.id}"
    await redis_client.set(key, json.dumps(draft_in.answers))
    return {"status": "saved"}

@router.post("/{exam_id}/submit")
async def submit_exam(
    *,
    db: AsyncSession = Depends(get_db),
    redis_client = Depends(get_redis),
    exam_id: int,
    submit_in: ExamSubmit,
    current_user: User = Depends(get_current_user),
):
    """
    Submit exam, calculate score for multiple choices, save to PostgreSQL, and clear Redis draft.
    """
    # Verify exam exists
    exam_result = await db.execute(select(Exam).options(selectinload(Exam.questions)).where(Exam.id == exam_id))
    exam = exam_result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
        
    # Check if already submitted
    sub_result = await db.execute(
        select(Submission).where(Submission.exam_id == exam_id, Submission.user_id == current_user.id)
    )
    existing_sub = sub_result.scalars().first()
    if existing_sub and existing_sub.status == "submitted":
        raise HTTPException(status_code=400, detail="Exam already submitted")

    # Grading Logic
    score = 0.0
    correct_count = 0
    total_mcq = 0
    
    answers_to_insert = []
    
    # Create submission record
    if not existing_sub:
        submission = Submission(
            exam_id=exam_id, 
            user_id=current_user.id, 
            status="submitted",
            violation_count=submit_in.violation_count,
            forced_submit=str(submit_in.forced_submit).lower()
        )
        db.add(submission)
        await db.flush() # get ID
    else:
        submission = existing_sub
        submission.status = "submitted"
        submission.violation_count = submit_in.violation_count
        submission.forced_submit = str(submit_in.forced_submit).lower()
    
    for q in exam.questions:
        ans_value = submit_in.answers.get(str(q.id))
        if q.type == "multiple_choice":
            total_mcq += 1
            if ans_value == q.correct_answer:
                correct_count += 1
                
        # Prepare Answer record
        is_mcq = q.type == "multiple_choice"
        answers_to_insert.append(
            Answer(
                submission_id=submission.id,
                question_id=q.id,
                selected_option=ans_value if is_mcq else None,
                text_response=ans_value if not is_mcq else None
            )
        )
        
    if total_mcq > 0:
        submission.score = (correct_count / total_mcq) * 10.0 # Scale to 10
        
    db.add_all(answers_to_insert)
    
    # Clear Redis Draft
    key = f"draft:{exam_id}:{current_user.id}"
    await redis_client.delete(key)
    
    from datetime import datetime, timezone
    submission.submitted_at = datetime.now(timezone.utc)
    await db.commit()
    
    return {"status": "submitted", "score": submission.score}

@router.get("/{exam_id}/report")
async def export_exam_report(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
):
    """
    Generate CSV Report of submissions.
    """
    result = await db.execute(
        select(Submission).where(Submission.exam_id == exam_id)
    )
    submissions = result.scalars().all()
    
    output = io.StringIO()
    output.write("Submission ID, User ID, Score, Status, Submitted At\n")
    for sub in submissions:
        output.write(f"{sub.id},{sub.user_id},{sub.score},{sub.status},{sub.submitted_at}\n")
        
    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=exam_{exam_id}_report.csv"
    return response

