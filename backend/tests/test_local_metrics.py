import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.exam import Exam
from app.models.submission import Submission
from app.models.user import User

async def main():
    async with AsyncSessionLocal() as db:
        exam_id = 2
            
        print("EXAM ID", exam_id)
        
        exam_result = await db.execute(select(Exam).where(Exam.id == exam_id))
        exam = exam_result.scalars().first()
        if not exam:
            print("Exam not found")
            return

        subs_result = await db.execute(
            select(Submission)
            .where(Submission.exam_id == exam_id, Submission.status == "submitted")
        )
        submissions = subs_result.scalars().all()

        total_submissions = len(submissions)
        print("TOTAL SUBS", total_submissions)
        if total_submissions == 0:
            print("Zero subs")
            return

        total_score = sum(s.score for s in submissions if s.score is not None)
        avg_score = total_score / total_submissions

        high_violations = []
        for s in submissions:
            # print("VIOLATION", s.violation_count)
            if (s.violation_count or 0) > 0 or s.forced_submit == "true":
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

        res = {
            "total_submissions": total_submissions,
            "average_score": round(avg_score, 2),
            "high_violations": high_violations,
            "accuracy_rate": round((avg_score / 10.0) * 100, 2) if avg_score else 0.0
        }
        print("RES", res)

if __name__ == "__main__":
    asyncio.run(main())
