"""empty message

Revision ID: 106c680234d2
Revises: 414ede9f841a
Create Date: 2020-03-10 17:02:07.989687

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '106c680234d2'
down_revision = '414ede9f841a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('TransactionDonation', 'bq_postDate',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('TransactionDonation', 'bq_postDate',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    # ### end Alembic commands ###
