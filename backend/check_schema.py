import asyncio
from sqlalchemy import text
from app.db.session import AsyncSessionLocal

async def check_db_schema():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'exams'
        """))
        columns = result.fetchall()
        print("Columns in 'exams' table:")
        for col in columns:
            print(f"- {col[0]}: {col[1]}")

if __name__ == "__main__":
    asyncio.run(check_db_schema())
