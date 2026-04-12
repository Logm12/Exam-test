import asyncio
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.exam import Exam

async def seed_exam():
    async with AsyncSessionLocal() as ds:
        # Check if exam 1 already exists
        exam = await ds.get(Exam, 1)
        if not exam:
            exam = Exam(
                id=1,
                title="Cuộc thi Pháp luật Đầu Vươn 2025",
                description="The first mock exam for testing landing page.",
                is_published=True,
                start_time=datetime.datetime.now(datetime.timezone.utc),
                end_time=(datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)).replace(tzinfo=None), # datetime issue? let's stick to tz naive if required, but model uses DateTime(timezone=True).
                duration=30,
                landing_config={
                    "organizer_name": "Đoàn TNCS Hồ Chí Minh",
                    "guide": "Vui lòng đọc kỹ thông tin trước khi bắt đầu."
                }
            )
            exam.end_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
            ds.add(exam)
            await ds.commit()
            print("Exam 1 seeded!")
        else:
            print("Exam 1 already exists.")

if __name__ == "__main__":
    asyncio.run(seed_exam())
