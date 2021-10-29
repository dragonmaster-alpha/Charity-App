import pytz
from datetime import date
from flask import Blueprint, Response, current_app, url_for, redirect
from flask_admin import Admin, AdminIndexView, expose, form
from flask_admin.contrib import sqla
from flask_admin.contrib.fileadmin.s3 import S3FileAdmin
from flask_admin.model import typefmt
from flask_basicauth import BasicAuth
from jinja2 import Markup
from werkzeug.exceptions import HTTPException

from api.handlers import (S3ImageUploadField, get_thumbgen, list_logos, list_thumbnail)
from api.models import (BankAccount, BasiqInstitution, BasiqToken, Card, Category, Charity, Customer, CustomerCharity,
                        EmailVerification, Feature, ParentCategory, Plan, TransactionDonation, WeeklyDonation, db,
                        TransferDonation)
from config import Config

basic_auth = BasicAuth()


def date_format(view, value):
    tz = pytz.timezone('Australia/Sydney')
    return pytz.utc.localize(value, is_dst=None).astimezone(tz).strftime('%d-%m-%Y %H:%M')


MY_DEFAULT_FORMATTERS = dict(typefmt.BASE_FORMATTERS)
MY_DEFAULT_FORMATTERS.update({
    type(None): typefmt.null_formatter,
    date: date_format
})


class MyHomeView(AdminIndexView):
    @expose('/')
    def is_visible(self):
        return False


class AuthException(HTTPException):
    def __init__(self, message):
        super().__init__(message, Response(
            message, 401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}))


class ModelView(sqla.ModelView):
    column_exclude_list = ('pwd_hash',)

    create_modal = True

    can_set_page_size = True
    page_size = 50

    def is_accessible(self):
        if not basic_auth.authenticate():
            raise AuthException('Not authenticated. Please refresh the page.')
        else:
            return True

    def inaccessible_callback(self, name, **kwargs):
        return redirect(basic_auth.challenge())


class CustomerView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS
    column_default_sort = ('created_at', True)
    column_list = (
        'id', 'first_name', 'last_name', 'email', 'weekly_goal',
        'bq_user_id', 'bq_connection_id', 'charities',
        'stripe_customer_id', 'created_at')
    form_excluded_columns = ('transaction_donations', )


class CharityView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS
    column_default_sort = ('created_at', True)
    column_list = (
        'id', 'name', 'business_name', 'category', 'email', 'abn', 'is_acnc',
        'logo', 'image', 'plan', 'customers', 'created_at',
        'is_email_verified', 'is_active', 'last_plan_payment')
    column_formatters = {
        'logo': list_thumbnail,
        'image': list_thumbnail}
    file_path = f"https://{Config.S3_BUCKET}.s3.amazonaws.com/"
    form_extra_fields = {
        'logo': S3ImageUploadField('Logo',
                                   base_path=file_path,
                                   thumbgen=get_thumbgen,
                                   thumbnail_size=(100, 100, False)),
        'image': S3ImageUploadField('Image',
                                    base_path=file_path,
                                    thumbgen=get_thumbgen,
                                    thumbnail_size=(100, 100, False))}
    column_exclude_list = ('customers',)
    form_excluded_columns = (
        'customers', 'transaction_donations', 'weekly_donations')


class CategoryView(ModelView):
    column_list = (
        'id', 'name', 'parent')


class PlanView(ModelView):
    column_formatters = {
        'logo': list_thumbnail}
    column_list = ('id', 'name', 'price', 'logo')
    file_path = f"https://{Config.S3_BUCKET}.s3.amazonaws.com/"
    form_extra_fields = {
        'logo': S3ImageUploadField('Logo',
                                   base_path=file_path,
                                   thumbgen=get_thumbgen,
                                   thumbnail_size=(100, 100, False))}
    form_columns = ('name', 'price', 'logo', 'features')


class FeatureView(ModelView):
    column_default_sort = ('id', False)
    column_list = ('id', 'text', 'plans')
    form_columns = ('text', 'plans')


class TransactionView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS
    column_default_sort = ('created_at', True)
    column_list = ('id', 'charity', 'customer', 'donat_amount', 'bq_amount', 'bq_title',
                   'bq_description', 'bq_transaction_id', 'bq_postDate', 'weekly_donation',
                   'created_at', 'status')


class WeeklyView(ModelView):
    can_view_details = True
    can_create = False
    can_edit = False
    column_type_formatters = MY_DEFAULT_FORMATTERS
    column_default_sort = ('created_at', True)
    column_list = ('id', 'charity', 'amount', 'stripe_transfer_id', 'status', 'created_at')


class TransferView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS
    column_default_sort = ('created_at', True)
    column_list = ('id', 'customer', 'charity', 'donat_amount', 'stripe_transfer_id', 'status', 'created_at')


class BasiqInstitutionView(ModelView):
    column_formatters = {
        'logo': list_logos}
    file_path = f"https://{Config.S3_BUCKET}.s3.amazonaws.com/"
    form_extra_fields = {
        'logo': S3ImageUploadField('Logo',
                                   base_path=file_path,
                                   thumbgen=get_thumbgen)}


class EmailVerificationView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS
    column_default_sort = ('created_at', True)


class CustomerCharityView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS


class CardView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS


class BasiqTokenView(ModelView):
    column_type_formatters = MY_DEFAULT_FORMATTERS


admin = Admin(name='MyCharity', template_mode='bootstrap3', index_view=MyHomeView())
admin.add_view(CustomerView(Customer, db.session))
admin.add_view(CharityView(Charity, db.session))
admin.add_view(CustomerCharityView(CustomerCharity, db.session))
admin.add_view(CategoryView(Category, db.session))
admin.add_view(ModelView(ParentCategory, db.session))
admin.add_view(PlanView(Plan, db.session))
admin.add_view(FeatureView(Feature, db.session))
admin.add_view(CardView(Card, db.session))
admin.add_view(ModelView(BankAccount, db.session))
admin.add_view(TransactionView(TransactionDonation, db.session))
admin.add_view(TransferView(TransferDonation, db.session))
admin.add_view(WeeklyView(WeeklyDonation, db.session))
admin.add_view(BasiqInstitutionView(BasiqInstitution, db.session))
admin.add_view(BasiqTokenView(BasiqToken, db.session))
admin.add_view(EmailVerificationView(EmailVerification, db.session))
