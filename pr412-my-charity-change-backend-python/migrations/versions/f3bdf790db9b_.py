"""empty message

Revision ID: f3bdf790db9b
Revises: f176760dc9f9
Create Date: 2020-05-28 13:12:37.028837

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f3bdf790db9b'
down_revision = 'f176760dc9f9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Customer', 'stripe_customer_id')
    op.add_column('User', sa.Column('stripe_customer_id', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('User', 'stripe_customer_id')
    op.add_column('Customer', sa.Column('stripe_customer_id', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    # ### end Alembic commands ###