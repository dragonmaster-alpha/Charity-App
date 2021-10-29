"""empty message

Revision ID: 014e1fbd56a6
Revises: affc255178e3
Create Date: 2020-02-13 15:59:36.346845

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '014e1fbd56a6'
down_revision = 'affc255178e3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('TransactionDonation', sa.Column('bq_transaction_id', sa.String(length=63), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('TransactionDonation', 'bq_transaction_id')
    # ### end Alembic commands ###