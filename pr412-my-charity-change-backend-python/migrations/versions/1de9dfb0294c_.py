"""empty message

Revision ID: 1de9dfb0294c
Revises: 1a4951993fa6
Create Date: 2020-09-22 17:23:03.684798

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1de9dfb0294c'
down_revision = '1a4951993fa6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Customer', sa.Column('weekly_notification', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('TransferDonation', sa.Column('weekly_donation_id', sa.INTEGER(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
