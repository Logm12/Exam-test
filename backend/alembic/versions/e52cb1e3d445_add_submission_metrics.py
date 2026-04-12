"""add submission metrics

Revision ID: e52cb1e3d445
Revises: 6d3321d58ca4
Create Date: 2026-03-18 17:20:53.932193

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'e52cb1e3d445'
down_revision: Union[str, Sequence[str], None] = '6d3321d58ca4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('submissions', sa.Column('correct_count', sa.Integer(), nullable=True))
    op.add_column('submissions', sa.Column('time_spent_seconds', sa.Integer(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('submissions', 'time_spent_seconds')
    op.drop_column('submissions', 'correct_count')
