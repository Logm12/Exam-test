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
    admin_username = os.environ.get("SEED_ADMIN_USERNAME", "admin")
    admin_password = os.environ.get("SEED_ADMIN_PASSWORD")
    student_username = os.environ.get("SEED_STUDENT_USERNAME", "student")
    student_password = os.environ.get("SEED_STUDENT_PASSWORD")

    if not admin_password or not student_password:
        print("ERROR: SEED_ADMIN_PASSWORD and SEED_STUDENT_PASSWORD must be set as environment variables.")
        sys.exit(1)

    async with AsyncSessionLocal() as db:
        admin_res = await db.execute(select(User).where(User.username == admin_username))
        admin_user = admin_res.scalars().first()
        if not admin_user:
            print(f"Creating admin user '{admin_username}'...")
            db.add(User(username=admin_username, password_hash=get_password_hash(admin_password), role="admin"))
        else:
            print(f"Admin user '{admin_username}' already exists, skipping.")

        student_res = await db.execute(select(User).where(User.username == student_username))
        student_user = student_res.scalars().first()
        if not student_user:
            print(f"Creating student user '{student_username}'...")
            db.add(User(username=student_username, password_hash=get_password_hash(student_password), role="student"))
        else:
            print(f"Student user '{student_username}' already exists, skipping.")

        await db.commit()
        print("Done seeding users.")

if __name__ == "__main__":
    asyncio.run(seed_users())
