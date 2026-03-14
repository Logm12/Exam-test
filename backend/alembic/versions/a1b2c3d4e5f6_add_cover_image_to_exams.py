"""add_cover_image_to_exams

Revision ID: a1b2c3d4e5f6
Revises: 465c28fe8735
Create Date: 2026-03-13 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '465c28fe8735'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('exams', sa.Column('cover_image', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('exams', 'cover_image')
