"""merge heads (students)

Revision ID: 6d3321d58ca4
Revises: a1b2c3d4e5f6, c2f31a7a9d14
Create Date: 2026-03-18 13:58:29.467418

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d3321d58ca4'
down_revision: Union[str, Sequence[str], None] = ('a1b2c3d4e5f6', 'c2f31a7a9d14')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
