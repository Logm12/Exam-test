import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.getcwd())

from sqlalchemy import text
from app.db.session import AsyncSessionLocal

async def check():
    async with AsyncSessionLocal() as db:
        res = await db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='submissions' AND column_name='correct_count'"))
        row = res.fetchone()
        if row:
            print("Exists")
        else:
            print("Missing")

if __name__ == "__main__":
    asyncio.run(check())
