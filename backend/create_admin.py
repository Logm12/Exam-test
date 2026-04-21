import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy.future import select

async def create_admin(username, password):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.username == username))
        user = result.scalars().first()
        if user:
            print(f"User {username} already exists")
            user.role = "admin"
            user.password_hash = get_password_hash(password)
            db.add(user)
        else:
            print(f"Creating admin user {username}")
            user = User(
                username=username,
                password_hash=get_password_hash(password),
                role="admin"
            )
            db.add(user)
        await db.commit()
        print("Admin user processed successfully")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <username> <password>")
    else:
        asyncio.run(create_admin(sys.argv[1], sys.argv[2]))
