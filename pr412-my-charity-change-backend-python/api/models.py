import enum
from datetime import datetime

from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

"""
The fields with prefix bq_ are from Basiq.io
The fields with prefix fp_ are from FIN-PAY
"""

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate(compare_type=True)


class UserType(enum.Enum):
    CUSTOMER = 'customer'
    CHARITY = 'charity'


class DirectStatus(enum.Enum):
    NEW = 'New'
    PENDING = 'Pending'
    COMPLETED = 'Completed'
    REJECTED = 'Rejected'
    DELETED = 'Deleted'


class TransferStatus(enum.Enum):
    NEW = 'New'
    LAST = 'Last'
    OLD = 'Old'


class CategoryName(enum.Enum):
    DISASTER_RELIEF = 'Disaster Relief'
    EDUCATION = 'Education'
    HOUSING = 'Housing'
    HUMAN_RIGHTS = 'Human Rights'
    HUNGER = 'Hunger'
    WATER = 'Water'
    AGEING = 'Ageing'
    ARTS_AND_CULTURE = 'Arts & Culture'
    CHILDREN_AND_YOUTH = 'Children & Youth'
    DOMESTIC_VIOLENCE = 'Domestic Violence'
    INDIGENOUS = 'Indigenous'
    LGBTI = 'LGBTI'
    PEACE = 'Peace'
    REFUGEES = 'Refugees'
    VETERANS = 'Veterans'
    WOMEN = 'Women'
    AGRICULTURE = 'Agriculture'
    ANIMAL_WELFARE = 'Animal Welfare'
    CLIMATE_CHANGE = 'Climate Change'
    ENVIRONMENT = 'Environment'
    BLINDNESS_AND_VISION = 'Blindness & Vision'
    CANCER = 'Cancer'
    DISABILITIES = 'Disabilities'
    GLOBAL_HEALTH = 'Global Health'
    HIV_AIDS = 'HIV/AIDS'
    MEDICAL_RESEARCH = 'Medical Research'
    MENTAL_HEALTH = 'Mental Health'


plan_features = db.Table(
    'plan_features',
    db.Column('plan_id', db.Integer, db.ForeignKey('Plan.id')),
    db.Column('feature_id', db.Integer, db.ForeignKey('Feature.id'))
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(127), unique=True, nullable=False)
    pwd_hash = db.Column(db.String(255), nullable=False)
    type = db.Column(db.Enum(UserType), nullable=True)
    stripe_customer_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)

    # this table had to be abstract
    __tablename__ = 'User'


class Customer(User):
    id = db.Column(None, db.ForeignKey('User.id'), primary_key=True)
    first_name = db.Column(db.String(127), nullable=True)
    last_name = db.Column(db.String(127), nullable=True)
    weekly_goal = db.Column(db.Integer, default=100)
    # charities = db.relationship("CustomerCharity", back_populates="customer")
    bq_user_id = db.Column(db.String(127), nullable=True)
    bq_connection_id = db.Column(db.String(127), nullable=True)
    device_token = db.Column(db.String(511), nullable=True)
    send_tax_reciept = db.Column(db.Boolean, default=False)
    weekly_notification = db.Column(db.Boolean, default=True)

    __tablename__ = 'Customer'

    def __init__(self, email, pwd_hash, type, first_name, last_name,
                 bq_user_id, device_token=None):
        self.email = email
        self.pwd_hash = pwd_hash
        self.type = type
        self.first_name = first_name
        self.last_name = last_name
        self.device_token = device_token
        self.bq_user_id = bq_user_id


class Charity(User):
    id = db.Column(None, db.ForeignKey('User.id'), primary_key=True)
    abn = db.Column(db.String(15), nullable=True)
    is_acnc = db.Column(db.Boolean, default=False)
    logo = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    plan_id = db.Column(db.Integer, db.ForeignKey('Plan.id'), nullable=True)
    plan = db.relationship('Plan', backref=db.backref('charities', lazy=True))
    name = db.Column(db.String(150), nullable=True)
    business_name = db.Column(db.String(150), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('Category.id'), nullable=True)
    category = db.relationship('Category', backref=db.backref('charities', lazy=True))
    details = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, default=False)
    is_email_verified = db.Column(db.Boolean, default=False)
    # customers = db.relationship("CustomerCharity", back_populates="charity")
    last_plan_payment = db.Column(db.DateTime, nullable=True)
    stripe_custom_account_id = db.Column(db.String(255), nullable=True)
    # for stripe
    # first_name = db.Column(db.String(255), nullable=True)
    # last_name = db.Column(db.String(255), nullable=True)
    # birth_date = db.Column(db.DateTime, nullable=True)

    __tablename__ = 'Charity'

    def __repr__(self):
        return f"{self.name or ''} id={self.id}"


class CustomerCharity(db.Model):
    customer_id = db.Column(db.Integer, db.ForeignKey('Customer.id', ondelete='CASCADE'), primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('Charity.id', ondelete='CASCADE'), primary_key=True)
    is_active = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    customer = db.relationship("Customer", backref=db.backref('charities', lazy=True, passive_deletes=True))
    charity = db.relationship("Charity", backref=db.backref('customers', lazy=True, passive_deletes=True))

    __tablename__ = 'CustomerCharity'

    def __repr__(self):
        return f"cus{self.customer_id}cha{self.charity_id}" or ''


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('ParentCategory.id', ondelete="CASCADE"), nullable=False)
    parent = db.relationship('ParentCategory', backref=db.backref('categories', lazy=True, passive_deletes=True))
    name = db.Column(db.String(63), nullable=False)

    __tablename__ = 'Category'

    def __repr__(self):
        return self.name or ''


class ParentCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(63), nullable=False)

    __tablename__ = 'ParentCategory'

    def __repr__(self):
        return self.name or ''


class Plan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(63), nullable=True)
    price = db.Column(db.Float(), nullable=True)
    logo = db.Column(db.String(255), nullable=True)
    features = db.relationship('Feature', secondary=plan_features,
                               backref=db.backref('plans', lazy=True))

    __tablename__ = 'Plan'

    def __repr__(self):
        return self.name or ''


class Feature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(512), nullable=True)

    __tablename__ = 'Feature'


class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.id', ondelete="CASCADE"), nullable=False)
    user = db.relationship('User', backref=db.backref('cards', lazy=True, passive_deletes=True))
    number = db.Column(db.String(31))
    name = db.Column(db.String(255))
    cvc = db.Column(db.String(11), nullable=True)
    expiration = db.Column(db.String(7))
    stripe_card_id = db.Column(db.String(31))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __tablename__ = 'Card'

    def __repr__(self):
        return self.number or ''


class BankAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('Charity.id', ondelete="CASCADE"), nullable=False)
    charity = db.relationship('Charity', backref=db.backref('bankAccounts', lazy=True, passive_deletes=True))
    name = db.Column(db.String(63), nullable=False)
    bsb = db.Column(db.String(11), nullable=False)
    number = db.Column(db.String(31), nullable=False)

    __tablename__ = 'BankAccount'

    def __repr__(self):
        return self.number or ''


class TransactionDonation(db.Model):
    # TransactionDonation is one little piece from each customer's purchase (< 0.50$)
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('Charity.id', ondelete='CASCADE'), nullable=True)
    charity = db.relationship('Charity',
                              backref=db.backref('transaction_donations', lazy=True, passive_deletes=True))
    customer_id = db.Column(db.Integer, db.ForeignKey('Customer.id', ondelete='CASCADE'), nullable=False)
    customer = db.relationship('Customer',
                               backref=db.backref('transaction_donations', lazy=True, passive_deletes=True))
    donat_amount = db.Column(db.Float(), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    bq_transaction_id = db.Column(db.String(63), nullable=False, unique=True)
    bq_amount = db.Column(db.Float(), nullable=True)
    bq_postDate = db.Column(db.DateTime, nullable=False)
    bq_description = db.Column(db.String(255), nullable=True)
    bq_title = db.Column(db.String(255), nullable=True)
    weekly_donation_id = db.Column(db.Integer, db.ForeignKey('WeeklyDonation.id', ondelete='CASCADE'), nullable=True)
    weekly_donation = db.relationship('WeeklyDonation',
                                      backref=db.backref('transaction_donations', lazy=True, passive_deletes=True))
    status = db.Column(db.Enum(TransferStatus), default=TransferStatus.NEW)

    __tablename__ = 'TransactionDonation'

    def __repr__(self):
        return f"{self.id}" or ''

    def __init__(self, customer_id, donat_amount, bq_transaction_id,
                 bq_amount, bq_postDate, bq_description, bq_title):
        self.customer_id = customer_id
        self.donat_amount = donat_amount
        self.bq_transaction_id = bq_transaction_id
        self.bq_amount = bq_amount
        self.bq_postDate = bq_postDate
        self.bq_description = bq_description
        self.bq_title = bq_title


class WeeklyDonation(db.Model):
    # once per week on Thursdays
    # 12 donations for 12 charities
    # the amount is collected from all customers' TransactionDonation weekly
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('Charity.id', ondelete='CASCADE'), nullable=False)
    charity = db.relationship('Charity', backref=db.backref('weekly_donations', lazy=True, passive_deletes=True))
    amount = db.Column(db.Float(), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    stripe_transfer_id = db.Column(db.String(63), nullable=True)
    status = db.Column(db.Enum(DirectStatus), default='NEW')

    __tablename__ = 'WeeklyDonation'

    def __repr__(self):
        return f"{self.id}" or ''


class BasiqToken(db.Model):
    # the table exists for only one record, which changes when the token expires
    # maybe add it to cron so that token will be always fresh - Done
    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.String(1023), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __tablename__ = 'BasiqToken'

    def __init__(self, access_token):
        self.access_token = access_token


class BasiqInstitution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bank_id = db.Column(db.String(255), nullable=True, unique=True)
    name = db.Column(db.String(255), nullable=True)
    shortName = db.Column(db.String(255), nullable=True)
    institutionType = db.Column(db.String(255), nullable=True)
    country = db.Column(db.String(255), nullable=True)
    serviceName = db.Column(db.String(255), nullable=True)
    serviceType = db.Column(db.String(255), nullable=True)
    loginIdCaption = db.Column(db.String(255), nullable=True)
    secondaryLoginIdCaption = db.Column(db.String(255), nullable=True)
    passwordCaption = db.Column(db.String(255), nullable=True)
    securityCodeCaption = db.Column(db.String(255), nullable=True)
    tier = db.Column(db.String(255), nullable=True)
    authorization = db.Column(db.String(255), nullable=True)
    logo = db.Column(db.String(255), nullable=True)
    link = db.Column(db.String(255), nullable=True)

    __tablename__ = 'BasiqInstitution'

    def __init__(self, **kwargs):
        for key in self.__table__.columns:
            if key.name != 'id':  # exclude id
                setattr(self, key.name, kwargs.get(key.name))


class EmailVerification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(255), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey(
        'Charity.id', ondelete="CASCADE"), nullable=False)
    charity = db.relationship('Charity', backref=db.backref(
        'email_verifications', lazy=True, passive_deletes=True))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __tablename__ = 'EmailVerification'


class TransferDonation(db.Model):
    # once per week on Thursdays
    # transfer donation from customer to charity
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('Charity.id', ondelete='CASCADE'), nullable=False)
    charity = db.relationship('Charity', backref=db.backref('transfer_donations', lazy=True, passive_deletes=True))
    customer_id = db.Column(db.Integer, db.ForeignKey('Customer.id', ondelete='CASCADE'), nullable=False)
    customer = db.relationship('Customer', backref=db.backref('transfer_donations', lazy=True, passive_deletes=True))
    donat_amount = db.Column(db.Float(), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    stripe_transfer_id = db.Column(db.String(63), nullable=True)
    status = db.Column(db.Enum(TransferStatus), default=TransferStatus.OLD)

    __tablename__ = 'TransferDonation'

    def __repr__(self):
        return f"{self.id}" or ''
