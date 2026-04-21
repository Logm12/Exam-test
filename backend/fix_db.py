import asyncio
from sqlalchemy import text
from app.db.session import AsyncSessionLocal

async def fix_database():
    async with AsyncSessionLocal() as session:
        # List of columns to check/add in 'exams' table
        cols = [
            ("cover_image", "VARCHAR"),
            ("end_time", "TIMESTAMP WITH TIME ZONE"),
            ("theme_config", "JSON"),
            ("landing_config", "JSON")
        ]
        
        for col_name, col_type in cols:
            try:
                # Check if column exists
                await session.execute(text(f"SELECT {col_name} FROM exams LIMIT 1"))
                print(f"Column '{col_name}' already exists in 'exams' table.")
            except Exception:
                await session.rollback()
                print(f"Adding column '{col_name}' to 'exams' table...")
                try:
                    await session.execute(text(f"ALTER TABLE exams ADD COLUMN {col_name} {col_type}"))
                    await session.commit()
                    print(f"Successfully added column '{col_name}'.")
                except Exception as e:
                    print(f"Failed to add column '{col_name}': {e}")
                    await session.rollback()

if __name__ == "__main__":
    asyncio.run(fix_database())
