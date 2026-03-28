from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.submission import Submission
from app.models.exam import Exam

router = APIRouter()

@router.get("/{exam_id}/metrics")
async def get_exam_metrics(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
    current_user: User = Depends(get_current_user),
):
    """
    Get analytical metrics for an exam (Admin only).
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Verify exam exists
    exam_result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = exam_result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    # Fetch all submissions for this exam
    subs_result = await db.execute(
        select(Submission)
        .where(Submission.exam_id == exam_id, Submission.status == "submitted")
    )
    submissions = subs_result.scalars().all()

    total_submissions = len(submissions)
    if total_submissions == 0:
        return {
            "total_submissions": 0,
            "average_score": 0.0,
            "high_violations": [],
            "accuracy_rate": 0.0
        }

    # Calculate average score
    total_score = sum(s.score for s in submissions if s.score is not None)
    avg_score = total_score / total_submissions

    # Find students with violations
    high_violations = []
    for s in submissions:
        count = s.violation_count or 0
        if count > 0 or s.forced_submit == "true":
            # We need user info, so let's fetch it or join it.
            # For simplicity in this endpoint:
            user_result = await db.execute(select(User).where(User.id == s.user_id))
            user = user_result.scalars().first()
            if user:
                high_violations.append({
                    "user_id": user.id,
                    "username": user.username,
                    "violation_count": s.violation_count,
                    "forced_submit": s.forced_submit == "true",
                    "score": s.score
                })

    return {
        "total_submissions": total_submissions,
        "average_score": round(avg_score, 2),
        "high_violations": high_violations,
        "accuracy_rate": round((avg_score / 10.0) * 100, 2) if avg_score else 0.0 # Assuming score is out of 10
    }
