import asyncio
from app.db.session import AsyncSessionLocal
from app.models.exam import Question
from sqlalchemy import select

async def seed_questions():
    async with AsyncSessionLocal() as ds:
        # Check if questions already exist for exam 1
        res = await ds.execute(select(Question).where(Question.exam_id == 1))
        existing = res.scalars().all()
        if not existing:
            questions = [
                Question(
                    exam_id=1,
                    content="Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam năm 2013 có bao nhiêu chương?",
                    type="multiple_choice",
                    options={"A": "9 chương", "B": "10 chương", "C": "11 chương", "D": "12 chương"},
                    correct_answer="C"
                ),
                Question(
                    exam_id=1,
                    content="Ai là người có quyền công bố Hiến pháp theo quy định hiện hành?",
                    type="multiple_choice",
                    options={"A": "Chủ tịch Quốc hội", "B": "Chủ tịch nước", "C": "Thủ tướng Chính phủ", "D": "Tổng Bí thư"},
                    correct_answer="B"
                )
            ]
            ds.add_all(questions)
            await ds.commit()
            print("Questions for Exam 1 seeded!")
        else:
            print("Questions for Exam 1 already exist.")

if __name__ == "__main__":
    asyncio.run(seed_questions())
