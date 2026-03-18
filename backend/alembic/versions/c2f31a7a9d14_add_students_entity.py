"""add_students_entity

Revision ID: c2f31a7a9d14
Revises: b0e401de9d0e
Create Date: 2026-03-18

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c2f31a7a9d14"
down_revision: Union[str, Sequence[str], None] = "b0e401de9d0e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=True),
        sa.Column("stt", sa.Integer(), nullable=True),
        sa.Column("full_name", sa.String(), nullable=False),
        sa.Column("date_of_birth", sa.Date(), nullable=True),
        sa.Column("class_name", sa.String(), nullable=True),
        sa.Column("mssv", sa.String(), nullable=True),
        sa.Column("school", sa.String(), nullable=True),
        sa.UniqueConstraint("user_id", name="uq_students_user_id"),
        sa.UniqueConstraint("mssv", name="uq_students_mssv"),
    )
    op.create_index("ix_students_id", "students", ["id"], unique=False)
    op.create_index("ix_students_user_id", "students", ["user_id"], unique=False)
    op.create_index("ix_students_stt", "students", ["stt"], unique=False)
    op.create_index("ix_students_mssv", "students", ["mssv"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_students_mssv", table_name="students")
    op.drop_index("ix_students_stt", table_name="students")
    op.drop_index("ix_students_user_id", table_name="students")
    op.drop_index("ix_students_id", table_name="students")
    op.drop_table("students")
