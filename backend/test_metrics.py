import asyncio
from sqlalchemy import select
from app.db.session import engine
from app.models.exam import Exam
from app.models.submission import Submission

async def get_metrics():
    async with engine.connect() as conn:
        res = await conn.execute(select(Exam.id).order_by(Exam.id.desc()).limit(2))
        exams = res.fetchall()
        print("EXAMS: ", exams)
        
        exam_id = exams[0][0] if exams else 1
        print("TRYING TO GET SUBMISSIONS FOR EXAM_ID:", exam_id)
        res = await conn.execute(select(Submission).where(Submission.exam_id == exam_id))
        subs = res.fetchall()
        print("SUBMISSIONS: ", subs)

if __name__ == "__main__":
    asyncio.run(get_metrics())
