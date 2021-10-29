from marshmallow import ValidationError, fields, validates_schema
from marshmallow.exceptions import ValidationError
from marshmallow_enum import EnumField
from marshmallow_validators.wtforms import from_wtforms
from wtforms.validators import Email, Length, NumberRange

from api import handlers

from .models import (BankAccount, BasiqInstitution, Card, Category,
                     CategoryName, Charity, Customer, Feature, Plan,
                     TransactionDonation, User, UserType, WeeklyDonation, ma)

locales = ['en_US', 'en']


"""
All marshmallow fields and schemas are here
"""


def hasNumbers(inputString):
    return any(char.isdigit() for char in inputString)


def hasLetters(inputString):
    return any(char.isalpha() for char in inputString) 


class LengthMessage(Length):
    def __init__(self, min=-1, max=-1, message=None):
        super(LengthMessage, self).__init__(min, max, message='Wrong length of value.')


class EmailField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        user = User.query.filter_by(email=value).first()
        if user:
            raise ValidationError("Email already registered.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class EmailCustomerSignupField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        user = User.query.filter_by(email=value).first()
        if user:
            if user.type.value != 'customer':
                raise ValidationError("Email already registered.")  # by charity
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class EmailCharityLoginField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        charity = Charity.query.filter_by(email=value).first()
        if not charity:
            raise ValidationError("Charity with this email is not registered.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class NameField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        if ' ' in value:
            raise ValidationError("Whitespace not allowed.")
        if not hasLetters(value):
            raise ValidationError("Only letters allowed.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class PasswordField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        if len(value) == 0:
            raise ValidationError("Missing data for required field.")
        if len(value) < 7:
            raise ValidationError("Please ensure password is at least 7 characters.")
        if value == value.lower():
            raise ValidationError("Please include at least 1 capital letter.")
        if not hasNumbers(value):
            raise ValidationError("Please include at least 1 number.")
        if not hasLetters(value):
            raise ValidationError("Please include at least 1 letter.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class CategoryIdField(fields.Integer):
    def _deserialize(self, value, *args, **kwargs):
        category = Category.query.get(value)
        if not category:
            raise ValidationError("Category not found.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class BSBField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        try:
            for index, char in enumerate(value):
                if index != 3:
                    int(char)
                elif index == 3:
                    if char != '-':
                        raise ValidationError("Wrong bsb. Example: 110-000")
        except:
            raise ValidationError("Wrong bsb.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class BankAccountField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        try:
            for char in value:
                int(char)
        except:
            raise ValidationError("Wrong bank account. Example: 123456789")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class PlanIdField(fields.Integer):
    def _deserialize(self, value, *args, **kwargs):
        plan = Plan.query.get(value)
        if not plan:
            raise ValidationError("Plan not found.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class CardNumberField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        try:
            for char in value:
                int(char)
        except:
            raise ValidationError("Wrong card number. Example: 1100220033004400")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class CardExpirationField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        message = 'Wrong expiration date. Example: 08/24'
        try:
            if len(value) != 5:
                raise ValidationError(message)
            for index, char in enumerate(value):
                if index != 2:
                    int(char)
                elif index == 2:
                    if char != '/':
                        raise ValidationError(message)
        except:
            raise ValidationError(message)
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class CardCVCField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        if value is None:
            return value
        try:
            for char in value:
                int(char)
        except:
            raise ValidationError("Wrong card cvc. Example: 552")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class ABNField(fields.Str):
    def _deserialize(self, value, *args, **kwargs):
        try:
            for char in value:
                int(char)
        except:
            raise ValidationError("Wrong ABN number. Example: 24719196762")
        # is_abn, is_acnc = handlers.check_abn(value)
        # if not is_abn:
        #     raise ValidationError("ABN not registered.")
        return value

    def _serialize(self, value, *args, **kwargs):
        return value


class CustomerSignupSchema(ma.SQLAlchemySchema):
    email = EmailCustomerSignupField(
        required=True,
        validate=from_wtforms([Email(), LengthMessage(min=6, max=127)], locales=locales))
    password = PasswordField(
        required=True,
        validate=from_wtforms([LengthMessage(max=127)], locales=locales))
    first_name = NameField(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=127)], locales=locales))
    last_name = NameField(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=127)], locales=locales))
    device_token = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(max=511)], locales=locales))


class CharityRegisterSchema(ma.SQLAlchemySchema):
    email = EmailField(
        required=True,
        validate=from_wtforms([Email(), LengthMessage(min=6, max=127)], locales=locales))
    password = PasswordField(
        required=True,
        validate=from_wtforms([LengthMessage(max=127)], locales=locales))
    name = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=150)], locales=locales))
    business_name = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=150)], locales=locales))
    category_id = CategoryIdField(
        required=True)   
    details = fields.Str(
        required=False,
        validate=from_wtforms([LengthMessage(max=500)], locales=locales))
    abn = ABNField(
        required=True,
        validate=from_wtforms([LengthMessage(min=11, max=11)], locales=locales))
    # is_acnc = fields.Boolean(
    #     required=True)
    bank_name = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(max=63)], locales=locales))
    bank_bsb = BSBField(
        required=True,
        validate=from_wtforms([LengthMessage(min=7, max=7)], locales=locales))
    # bank_bsb = fields.Str(
    #     required=True,
    #     validate=from_wtforms([LengthMessage(max=11)], locales=locales))
    bank_account = BankAccountField(
        required=True,
        validate=from_wtforms([LengthMessage(min=6, max=9)], locales=locales))
    # bank_account = fields.Str(
    #     required=True,
    #     validate=from_wtforms([LengthMessage(max=31)], locales=locales))
    stripe_custom_account_id = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(max=63)], locales=locales))
    plan_id = PlanIdField(
        required=True)
    # card_token = fields.Str(
    #     required=True)
    card_number = CardNumberField(
        required=True,
        validate=from_wtforms([LengthMessage(min=14, max=16)], locales=locales))
    card_holder = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=255)], locales=locales))
    card_expiration = CardExpirationField(       
        required=True,
        validate=from_wtforms([LengthMessage(min=5, max=5)], locales=locales))
    card_cvc = CardCVCField(
        required=False,
        validate=from_wtforms([LengthMessage(min=3, max=4)], locales=locales))
    stripe_card_id = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(max=63)], locales=locales))
    stripe_customer_id = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(max=63)], locales=locales))

    # first_name = fields.Str(
    #     required=True,
    #     validate=from_wtforms([LengthMessage(max=255)], locales=locales))
    # last_name = fields.Str(
    #     required=True,
    #     validate=from_wtforms([LengthMessage(max=255)], locales=locales))
    # birth_date = fields.Date(
    #     required=True
    # )


class CharityLoginSchema(ma.SQLAlchemySchema):
    email = EmailCharityLoginField(
        required=True,
        validate=from_wtforms([Email(), LengthMessage(min=6, max=127)], locales=locales))
    password = PasswordField(
        required=True,
        validate=from_wtforms([LengthMessage(max=127)], locales=locales))


class CustomerProfileSchema(ma.SQLAlchemySchema):
    weekly_goal = fields.Integer(
        required=True,
        validate=from_wtforms([NumberRange(min=2, max=200)], locales=locales))
    email = EmailCustomerSignupField(
        required=True,
        validate=from_wtforms([Email(), LengthMessage(min=6, max=127)], locales=locales))
    first_name = NameField(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=127)], locales=locales))
    last_name = NameField(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=127)], locales=locales))
    device_token = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(max=511)], locales=locales))


class CustomerEditProfileSchema(ma.SQLAlchemySchema):
    weekly_goal = fields.Integer(
        required=False,
        validate=from_wtforms([NumberRange(min=2, max=200)], locales=locales))
    email = fields.Str(
        required=False,
        validate=from_wtforms([Email(), LengthMessage(min=6, max=127)], locales=locales))
    first_name = NameField(
        required=False,
        validate=from_wtforms([LengthMessage(min=1, max=127)], locales=locales))
    last_name = NameField(
        required=False,
        validate=from_wtforms([LengthMessage(min=1, max=127)], locales=locales))

    @validates_schema
    def validate_email(self, data, **kwargs):
        if self.context.get('user_email', None) and data.get('email', None):
            if self.context['user_email'] != data['email']:
                user = User.query.filter_by(email=data['email']).first()
                if user:
                    raise ValidationError({"email": ["Email already registered."]})


class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        fields = ('id', 'name')


class PlanSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Plan


class FeatureSchema(ma.SQLAlchemyAutoSchema):
    plans = fields.Function(lambda obj: [plan.id for plan in obj.plans])

    class Meta:
        model = Feature
        fields = ('id', 'text', 'plans')

    # def get_plans(self, obj):
    #     ids = 
    #     return ids


class BasiqInstitutionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BasiqInstitution
        fields = ('bank_id', 'name', 'shortName', 'tier', 'loginIdCaption', 
                  'secondaryLoginIdCaption', 'passwordCaption', 'securityCodeCaption',
                  'logo')


class BankConnectionSchema(ma.SQLAlchemySchema):
    user_id = fields.Integer(
        required=True)
    bank_id = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=4, max=255)], locales=locales))
    loginId = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=2, max=255)], locales=locales))
    secondaryLoginId = fields.Str(
        required=False)
    password = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=255)], locales=locales))
    securityCode = fields.Str(
        required=False)


class UpdateCharitiesSchema(ma.SQLAlchemySchema):
    charity_ids = fields.List(
        fields.Integer(),
        required=True)

    @validates_schema
    def validate_charity_ids(self, data, **kwargs):
        ids = data['charity_ids']
        if len(ids) == 0:
            raise ValidationError({'charity_ids': ['At least one charity id schould be included.']})  
        if len(ids) > 3:
            raise ValidationError({'charity_ids': ['No more than 3 charities allowed.']})  
        if len(ids) != len(set(ids)):
            raise ValidationError({'charity_ids': ['Charities ids schould be unique.']})
        for id_ in ids:
            charity = Charity.query.get(id_)
            if not charity:
                raise ValidationError({'charity_ids': ['Charities with these ids not exist.']})    
            if charity.is_active == False:
                raise ValidationError({'charity_ids': ['Please exclude disapproved charities.']})
            

class CustomerCardSchema(ma.SQLAlchemySchema):
    card_number = CardNumberField(
        required=True,
        validate=from_wtforms([LengthMessage(min=14, max=16)], locales=locales))
    card_holder = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=255)], locales=locales))
    card_expiration = CardExpirationField(       
        required=True)
    card_cvc = CardCVCField(
        required=False,
        validate=from_wtforms([LengthMessage(min=3, max=4)], locales=locales))


class BankAccountSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BankAccount
        fields = ('id', 'name', 'bsb', 'number')


class CardSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Card
        fields = ('id', 'number', 'name', 'cvc', 'expiration')


class CharitySchema(ma.SQLAlchemyAutoSchema):
    type = EnumField(UserType, by_value=True)
    category = fields.Nested(CategorySchema)
    plan = fields.Nested(PlanSchema)
    bank_account = fields.Method("get_bank_account")
    payment_details = fields.Method("get_payment_details")

    class Meta:
        model = Charity
        fields = ('id', 'name', 'business_name', 'category', 'plan', 'details', 'logo', 
                  'image', 'abn', 'bank_account', 'payment_details')

    def get_bank_account(self, obj):
        if obj.bankAccounts:
            return BankAccountSchema().dump(obj.bankAccounts[-1])
        else:
            return None

    def get_payment_details(self, obj):
        if obj.cards:
            return CardSchema().dump(obj.cards[-1])
        else:
            return None    


class CharityShortSettingsSchema(ma.SQLAlchemySchema):
    name = fields.Str(
        required=False,
        validate=from_wtforms([LengthMessage(min=1, max=150)], locales=locales))
    business_name = fields.Str(
        required=False,
        validate=from_wtforms([LengthMessage(min=1, max=150)], locales=locales))    
    category_id = CategoryIdField(
        required=False)   
    details = fields.Str(
        required=False,
        validate=from_wtforms([LengthMessage(max=500)], locales=locales))
    plan_id = PlanIdField(
        required=False)
    abn = ABNField(
        required=False,
        validate=from_wtforms([LengthMessage(min=11, max=11)], locales=locales))
    image = fields.Field(
        required=False,
        allow_none=True)

    @validates_schema
    def validate_image(self, data, **kwargs):
        if data.get('image', None) and data['image'] not in ('', None):
            raise ValidationError({"image": ["Only empty or image object allowed."]})


class CharityValidationSchema(ma.SQLAlchemySchema):
    email = EmailField(
        required=True,
        validate=from_wtforms([Email(), LengthMessage(min=6, max=127)], locales=locales))
    password = PasswordField(
        required=True,
        validate=from_wtforms([LengthMessage(max=127)], locales=locales))
    confirm_password = fields.Str(
        required=True)

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if data['password'] != data['confirm_password']:
            raise ValidationError({"confirm_password": ["Passwords don't match."]})


class CharityInformationValidationSchema(ma.SQLAlchemySchema):
    name = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=150)], locales=locales))
    business_name = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=150)], locales=locales))
    category_id = CategoryIdField(
        required=True)   
    details = fields.Str(
        required=False,
        validate=from_wtforms([LengthMessage(max=500)], locales=locales))
    abn = ABNField(
        required=True,
        validate=from_wtforms([LengthMessage(min=11, max=11)], locales=locales))


class CharityBankValidationSchema(ma.SQLAlchemySchema):
    bank_name = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(max=63)], locales=locales))
    bank_bsb = BSBField(
        required=True,
        validate=from_wtforms([LengthMessage(min=7, max=7)], locales=locales))
    # bank_bsb = fields.Str(
    #     required=True)
        # validate=from_wtforms([LengthMessage(max=11)], locales=locales))
    bank_account = BankAccountField(
        required=True,
        validate=from_wtforms([LengthMessage(min=6, max=9)], locales=locales))
    # bank_account = fields.Str(
    #     required=True)
        # validate=from_wtforms([LengthMessage(max=31)], locales=locales))
    email = EmailField(
        required=True,
        validate=from_wtforms([Email(), LengthMessage(min=6, max=127)], locales=locales))


class CharityCardValidationSchema(ma.SQLAlchemySchema):
    card_number = CardNumberField(
        required=True,
        validate=from_wtforms([LengthMessage(min=14, max=16)], locales=locales))
    card_holder = fields.Str(
        required=True,
        validate=from_wtforms([LengthMessage(min=1, max=255)], locales=locales))
    card_expiration = CardExpirationField(       
        required=True,
        validate=from_wtforms([LengthMessage(min=5, max=5)], locales=locales))
    card_cvc = CardCVCField(
        required=False,
        validate=from_wtforms([LengthMessage(min=3, max=4)], locales=locales))
