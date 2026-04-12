import argparse
import asyncio
import os
import random
import sys
from datetime import date
from typing import Optional

from sqlalchemy import select

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.core.security import get_password_hash
from app.db.session import AsyncSessionLocal
from app.models.student import Student
from app.models.user import User


LAST_NAMES = [
    "Nguyễn",
    "Trần",
    "Lê",
    "Phạm",
    "Hoàng",
    "Huỳnh",
    "Phan",
    "Vũ",
    "Võ",
    "Đặng",
    "Bùi",
    "Đỗ",
    "Hồ",
    "Ngô",
    "Dương",
    "Lý",
]

MIDDLE_NAMES = [
    "Văn",
    "Thị",
    "Minh",
    "Ngọc",
    "Đức",
    "Quang",
    "Hữu",
    "Gia",
    "Thanh",
]

FIRST_NAMES = [
    "An",
    "Bình",
    "Chi",
    "Dũng",
    "Giang",
    "Hà",
    "Hải",
    "Hân",
    "Hiếu",
    "Hoà",
    "Hùng",
    "Huy",
    "Khánh",
    "Khoa",
    "Linh",
    "Long",
    "Mai",
    "Nam",
    "Nga",
    "Nhi",
    "Phúc",
    "Phương",
    "Quân",
    "Quỳnh",
    "Sơn",
    "Thảo",
    "Trang",
    "Tú",
    "Tuấn",
    "Vân",
]

SCHOOLS = [
    "THPT Chuyên Lê Hồng Phong",
    "THPT Nguyễn Thượng Hiền",
    "THPT Trần Phú",
    "THPT Nguyễn Du",
    "THPT Lý Tự Trọng",
]

CLASSES = [
    "10A1",
    "10A2",
    "10A3",
    "11A1",
    "11A2",
    "11A3",
    "12A1",
    "12A2",
    "12A3",
]


def _full_name(rng: random.Random) -> str:
    last = rng.choice(LAST_NAMES)
    middle = rng.choice(MIDDLE_NAMES)
    first = rng.choice(FIRST_NAMES)
    return f"{last} {middle} {first}"


def _dob(rng: random.Random) -> date:
    year = rng.randint(2004, 2008)
    month = rng.randint(1, 12)
    # Keep it simple and always valid
    day = rng.randint(1, 28)
    return date(year, month, day)


async def seed_students(*, start: int, count: int, password: str, seed: int) -> None:
    rng = random.Random(seed)

    created_users = 0
    created_profiles = 0
    updated_profiles = 0

    async with AsyncSessionLocal() as db:
        for i in range(start, start + count):
            username = f"student{i:03d}"
            mssv = f"SV{i:06d}"

            user_res = await db.execute(select(User).where(User.username == username))
            user: Optional[User] = user_res.scalars().first()
            if not user:
                user = User(
                    username=username,
                    password_hash=get_password_hash(password),
                    role="student",
                )
                db.add(user)
                await db.flush()  # assign user.id
                created_users += 1
            else:
                # Keep role consistent; do not overwrite password by default
                if user.role != "student":
                    user.role = "student"

            student_res = await db.execute(select(Student).where(Student.user_id == user.id))
            profile: Optional[Student] = student_res.scalars().first()

            payload = dict(
                stt=i,
                full_name=_full_name(rng),
                date_of_birth=_dob(rng),
                class_name=rng.choice(CLASSES),
                mssv=mssv,
                school=rng.choice(SCHOOLS),
                user_id=user.id,
            )

            if not profile:
                db.add(Student(**payload))
                created_profiles += 1
            else:
                for k, v in payload.items():
                    setattr(profile, k, v)
                updated_profiles += 1

        await db.commit()

    print(
        "Seed complete: "
        f"users_created={created_users}, "
        f"profiles_created={created_profiles}, "
        f"profiles_updated={updated_profiles}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed mock Student users + profiles")
    parser.add_argument("--start", type=int, default=1, help="Starting STT/index (default: 1)")
    parser.add_argument("--count", type=int, default=30, help="How many students to create (default: 30)")
    parser.add_argument(
        "--password",
        type=str,
        default="password123",
        help="Password for newly created users (default: password123)",
    )
    parser.add_argument("--seed", type=int, default=20260318, help="Random seed (default: 20260318)")
    args = parser.parse_args()

    asyncio.run(seed_students(start=args.start, count=args.count, password=args.password, seed=args.seed))


if __name__ == "__main__":
    main()
