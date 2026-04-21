import asyncio
from sqlalchemy import text
from app.db.session import engine

async def migrate():
    print("Starting migration...")
    async with engine.begin() as conn:
        # Add shuffle_questions column
        try:
            await conn.execute(text("ALTER TABLE exams ADD COLUMN shuffle_questions BOOLEAN DEFAULT FALSE;"))
            print("Added column shuffle_questions")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("Column shuffle_questions already exists")
            else:
                print(f"Error adding shuffle_questions: {e}")

        # Add shuffle_options column
        try:
            await conn.execute(text("ALTER TABLE exams ADD COLUMN shuffle_options BOOLEAN DEFAULT FALSE;"))
            print("Added column shuffle_options")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("Column shuffle_options already exists")
            else:
                print(f"Error adding shuffle_options: {e}")
                
    print("Migration finished.")

if __name__ == "__main__":
    asyncio.run(migrate())
