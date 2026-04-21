"""add_team_name_to_students

Revision ID: f1a2b3c4d5e6
Revises: b0e401de9d0e
Create Date: 2026-04-21 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, None] = 'b0e401de9d0e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('students', sa.Column('team_name', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('students', 'team_name')
