import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.username == 'admin'))
        u = res.scalars().first()
        if u:
            print(f'USER: {u.username}, ROLE: {u.role}')
        else:
            print('USER admin NOT FOUND')

if __name__ == "__main__":
    asyncio.run(check())
