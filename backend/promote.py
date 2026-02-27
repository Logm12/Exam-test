import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text

DATABASE_URL = 'postgresql+asyncpg://exam_user:exam_password@localhost:5432/online_exam'

async def promote_admin():
    engine = create_async_engine(DATABASE_URL)
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    
    async with async_session() as session:
        await session.execute(text("UPDATE users SET role = 'admin' WHERE username = 'admin'"))
        await session.execute(text("UPDATE users SET role = 'admin' WHERE username = 'admin123'"))
        await session.commit()
        print('Promoted admin and admin123 to admin.')

asyncio.run(promote_admin())
