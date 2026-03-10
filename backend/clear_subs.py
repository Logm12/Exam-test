import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings

async def clear_data():
    engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        await session.execute(text("DELETE FROM answers;"))
        await session.execute(text("DELETE FROM submissions;"))
        await session.commit()
    print("Cleaned up submissions and answers data.")

if __name__ == "__main__":
    asyncio.run(clear_data())
