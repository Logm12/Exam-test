from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
import json
import os
import tempfile
import io
import uuid
import shutil

from app.db.session import get_db
from app.db.redis import get_redis, get_optional_redis
from app.api.deps import get_current_user, get_current_active_admin
from app.models.user import User
from app.models.exam import Exam, Question
from app.models.submission import Submission, Answer
from app.schemas.exam import Exam as ExamSchema, ExamCreate, ExamUpdate, ExamPublic
from app.schemas.student_exam import StudentExam
from app.schemas.submission import AnswerDraft, ExamSubmit
from sqlalchemy.orm import selectinload
from sqlalchemy import func

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()


@router.get("/public", response_model=List[ExamPublic])
async def read_public_exams(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Public endpoint: list published exams with lightweight counts."""
    result = await db.execute(
        select(
            Exam,
            func.count(func.distinct(Question.id)).label("question_count"),
            func.count(func.distinct(Submission.id)).label("participants"),
        )
        .outerjoin(Question, Question.exam_id == Exam.id)
        .outerjoin(Submission, Submission.exam_id == Exam.id)
        .where(Exam.is_published == True)
        .group_by(Exam.id)
        .order_by(Exam.start_time.desc())
        .offset(skip)
        .limit(limit)
    )

    rows = result.all()
    return [
        {
            "id": exam.id,
            "title": exam.title,
            "description": exam.description,
            "slug": exam.slug,
            "cover_image": exam.cover_image,
            "duration": exam.duration,
            "start_time": exam.start_time,
            "created_at": exam.created_at,
            "is_published": exam.is_published,
            "question_count": int(question_count or 0),
            "participants": int(participants or 0),
        }
        for exam, question_count, participants in rows
    ]

@router.get("/", response_model=List[ExamSchema])
async def read_exams(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user), # Any logged in user
) -> Any:
    result = await db.execute(select(Exam).offset(skip).limit(limit))
    exams = result.scalars().all()
    return exams

@router.get("/me", response_model=Any)
async def get_my_exams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    # get all published exams
    result = await db.execute(select(Exam).where(Exam.is_published == True))
    exams = result.scalars().all()
    
    # get user's submissions
    sub_res = await db.execute(select(Submission).where(Submission.user_id == current_user.id))
    submissions = sub_res.scalars().all()
    sub_map = {s.exam_id: s for s in submissions}
    
    final_exams = []
    for e in exams:
        d = {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "duration": e.duration,
            "start_time": e.start_time,
            "created_at": e.created_at,
            "is_published": e.is_published,
            "slug": e.slug,
            "cover_image": e.cover_image,
        }
        if e.id in sub_map:
            s_obj = sub_map[e.id]
            d["status"] = s_obj.status
            d["score"] = s_obj.score
        final_exams.append(d)
        
    return final_exams

@router.post("/", response_model=ExamSchema)
async def create_exam(
    *,
    db: AsyncSession = Depends(get_db),
    exam_in: ExamCreate,
    current_user: User = Depends(get_current_active_admin), # Admin Only
) -> Any:
    exam_data = exam_in.model_dump()
    exam_data["slug"] = Exam.generate_slug()
    exam = Exam(**exam_data)
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return exam


@router.post("/{exam_id}/upload-image", response_model=ExamSchema)
async def upload_exam_image(
    exam_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """Upload a cover image for an exam. Accepts jpg/png/webp, max 5MB."""
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    MAX_SIZE = 5 * 1024 * 1024  # 5 MB

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only jpg, png, webp, gif images are allowed")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Invalid file extension")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Image exceeds 5MB limit")

    # Delete old image file if exists
    if exam.cover_image:
        old_filename = exam.cover_image.split("/uploads/")[-1]
        old_path = os.path.join(UPLOAD_DIR, old_filename)
        if os.path.exists(old_path):
            os.remove(old_path)

    filename = f"exam_{exam_id}_{uuid.uuid4().hex[:8]}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)
    with open(save_path, "wb") as f:
        f.write(contents)

    exam.cover_image = f"/uploads/{filename}"
    await db.commit()
    await db.refresh(exam)
    return exam


@router.post("/import-questions", dependencies=[Depends(get_current_active_admin)])
async def import_questions_from_file(
    file: UploadFile = File(...),
):
    """
    Upload a .docx or .pdf file (max 10MB) and extract questions.
    Returns a list of parsed questions for review before adding to an exam.
    """
    MAX_SIZE = 10 * 1024 * 1024  # 10 MB
    allowed_types = (".doc", ".docx", ".pdf")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_types:
        raise HTTPException(status_code=400, detail="Only .doc, .docx and .pdf files are supported")

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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_active_admin),
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
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    # Use raw SQL DELETE to ensure DB-level ON DELETE CASCADE is triggered reliably
    # and to bypass potential AsyncSession ORM cascade loading issues.
    await db.execute(delete(Exam).where(Exam.id == exam_id))
    await db.commit()
    return {"ok": True}


@router.post("/{exam_id}/draft")
async def save_exam_draft(
    *,
    db: AsyncSession = Depends(get_db),
    redis_client = Depends(get_optional_redis),
    exam_id: int,
    draft_in: AnswerDraft,
    current_user: User = Depends(get_current_user),
):
    """
    Save exam draft to Redis.
    """
    if not redis_client:
        # Silently fail for drafts if Redis is down, or return error?
        # User requested robustness, so we just return success but don't save.
        return {"status": "skipped", "message": "Redis unavailable"}
    
    try:
        key = f"draft:{exam_id}:{current_user.id}"
        await redis_client.set(key, json.dumps(draft_in.answers))
        return {"status": "saved"}
    except Exception as e:
        print(f"Error saving draft: {e}")
        return {"status": "error", "message": str(e)}

@router.post("/{exam_id}/submit")
async def submit_exam(
    *,
    db: AsyncSession = Depends(get_db),
    redis_client = Depends(get_optional_redis),
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
            forced_submit=str(submit_in.forced_submit).lower(),
            time_spent_seconds=submit_in.time_spent_seconds,
        )
        db.add(submission)
        await db.flush() # get ID
    else:
        submission = existing_sub
        submission.status = "submitted"
        submission.violation_count = submit_in.violation_count
        submission.forced_submit = str(submit_in.forced_submit).lower()
        submission.time_spent_seconds = submit_in.time_spent_seconds
        
        # Clear existing answers to avoid duplication and unique constraint errors
        await db.execute(delete(Answer).where(Answer.submission_id == submission.id))
        await db.flush()
    
    for q in exam.questions:
        ans_value = submit_in.answers.get(str(q.id))
        if q.type == "multiple_choice":
            total_mcq += 1
            # Strict validation for correct answer
            if ans_value is not None and q.correct_answer is not None and str(ans_value).strip() != "" and str(ans_value).strip() == str(q.correct_answer).strip():
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
        
    submission.correct_count = correct_count

    db.add_all(answers_to_insert)
    
    # Clear Redis Draft (Wrap in try/except for long-term deployment stability 
    # if Redis is temporarily unavailable)
    if redis_client:
        try:
            key = f"draft:{exam_id}:{current_user.id}"
            await redis_client.delete(key)
        except Exception as e:
            print(f"Warning: Failed to clear Redis draft: {e}")
    
    from datetime import datetime, timezone
    submission.submitted_at = datetime.now(timezone.utc)
    await db.commit()
    
    return {"status": "submitted", "score": submission.score}

@router.get("/{exam_id}/report")
async def export_exam_report(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
    current_user: User = Depends(get_current_active_admin),
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

@router.get("/{exam_id}/submissions")
async def get_exam_submissions(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Get all submissions for an exam (Admin only), joined with username.
    """
    result = await db.execute(select(Submission).where(Submission.exam_id == exam_id))
    submissions = result.scalars().all()
    
    res = []
    for sub in submissions:
        user_result = await db.execute(select(User).where(User.id == sub.user_id))
        user = user_result.scalars().first()
        res.append({
            "id": sub.id,
            "user_id": sub.user_id,
            "username": user.username if user else "Unknown",
            "score": sub.score,
            "status": sub.status,
            "submitted_at": str(sub.submitted_at) if sub.submitted_at else None,
            "violation_count": sub.violation_count,
            "forced_submit": sub.forced_submit
        })
    return res

