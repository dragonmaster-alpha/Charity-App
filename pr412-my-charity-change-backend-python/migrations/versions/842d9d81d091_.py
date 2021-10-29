"""empty message

Revision ID: 842d9d81d091
Revises: fbf0ff16c1e8
Create Date: 2020-03-20 10:37:52.376395

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '842d9d81d091'
down_revision = 'fbf0ff16c1e8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Charity', sa.Column('is_email_verified', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Charity', 'is_email_verified')
    # ### end Alembic commands ###
