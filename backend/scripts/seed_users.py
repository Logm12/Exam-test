import asyncio
import os
import sys

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select

async def seed_users():
    async with AsyncSessionLocal() as db:
        admin_res = await db.execute(select(User).where(User.username == "admin"))
        admin_user = admin_res.scalars().first()
        if not admin_user:
            print("Creating admin user...")
            db.add(User(username="admin", password_hash=get_password_hash("admin123"), role="admin"))
        else:
            print("Updating admin user password...")
            admin_user.password_hash = get_password_hash("admin123")
            admin_user.role = "admin"
            
        student_res = await db.execute(select(User).where(User.username == "student"))
        student_user = student_res.scalars().first()
        if not student_user:
            print("Creating student user...")
            db.add(User(username="student", password_hash=get_password_hash("password123"), role="student"))
        else:
            print("Updating student user password...")
            student_user.password_hash = get_password_hash("password123")
            student_user.role = "student"
            
        await db.commit()
        print("Done seeding users.")

if __name__ == "__main__":
    asyncio.run(seed_users())
