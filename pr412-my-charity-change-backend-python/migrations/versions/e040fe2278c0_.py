"""empty message

Revision ID: e040fe2278c0
Revises: 66e8d4024a3e
Create Date: 2020-05-13 17:54:00.997150

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e040fe2278c0'
down_revision = '66e8d4024a3e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('BankAccount', 'fp_account_id')
    op.add_column('Charity', sa.Column('stripe_custom_account_id', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Charity', 'stripe_custom_account_id')
    op.add_column('BankAccount', sa.Column('fp_account_id', sa.VARCHAR(length=31), autoincrement=False, nullable=False))
    # ### end Alembic commands ###
