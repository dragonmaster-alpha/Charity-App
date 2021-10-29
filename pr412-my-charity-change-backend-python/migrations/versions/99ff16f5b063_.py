"""empty message

Revision ID: 99ff16f5b063
Revises: 842d9d81d091
Create Date: 2020-05-12 17:14:45.445355

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99ff16f5b063'
down_revision = '842d9d81d091'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Charity', 'is_email_verified')
    op.add_column('Customer', sa.Column('stripe_customer_id', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Customer', 'stripe_customer_id')
    op.add_column('Charity', sa.Column('is_email_verified', sa.BOOLEAN(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###