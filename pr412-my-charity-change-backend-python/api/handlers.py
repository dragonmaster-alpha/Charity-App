import csv
import logging
import math
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from io import BytesIO, StringIO
from uuid import uuid4
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen


import boto3
import requests
from cairosvg import svg2png
from flask import make_response, render_template
from flask_admin._compat import urljoin
from flask_admin.form.upload import ImageUploadField, ImageUploadInput
from jinja2 import Markup
from pandas import DataFrame, ExcelWriter
from pyfcm import FCMNotification
from sqlalchemy import event
from werkzeug.security import generate_password_hash


from api import basiq, models, payment, utils
from api.models import db
from config import Config

"""
Some userful helper functions are placed here
"""

logger = logging.getLogger('root')


def get_weekly_donations(customer, only_unpaid=False):
    # get amount of weekly donations
    donats = models.TransactionDonation.query.filter(
        models.TransactionDonation.customer_id == customer.id,
        models.TransactionDonation.status == 'NEW').\
        order_by(models.TransactionDonation.created_at.asc()).all()
    # models.TransactionDonation.weekly_donation_id == None)

    if only_unpaid:
        # if only_unpaid, get only donats without charity_id
        # it means that customer wasn't charged for the donat
        # used only in one place - during charging by customer
        # donats = donats.filter(models.TransactionDonation.charity_id == None)
        for donat in donats:
            donat.status = models.TransferStatus.LAST
        db.session.commit()

    logger.info(f"get_weekly_donations. donats: {donats}")
    weekly_amount = 0.0
    for donat in donats:
        logger.info(f"get_weekly_donations. weekly_amount: {weekly_amount}")
        if weekly_amount + donat.donat_amount <= customer.weekly_goal + 0.5:
            weekly_amount += donat.donat_amount
        else:  # this is a rare case, remove excess donats for correction
            # db.session.delete(donat)
            # db.session.commit()
            pass
    return round(weekly_amount, 2)


def get_charity_donations(customer, charity_id):
    # donations = models.TransactionDonation.query.filter(
    #     models.TransactionDonation.customer_id == customer.id,
    #     models.TransactionDonation.charity_id == charity_id,
    #     models.TransactionDonation.weekly_donation_id != None)
    donations = models.TransferDonation.query.filter(
        models.TransferDonation.customer_id == customer.id,
        models.TransferDonation.charity_id == charity_id,
    )
    total_charity_amount = 0.0
    for donation in donations:
        total_charity_amount += donation.donat_amount
    return round(total_charity_amount, 2)


def get_weekly_donations_by_id(customer, weekly_donation):
    # get weekly donations amount to single charity
    if not weekly_donation:
        return 0.0
    donats = models.TransactionDonation.query.filter(
        models.TransactionDonation.customer_id == customer.id,
        models.TransactionDonation.weekly_donation_id == weekly_donation.id)

    customer_weekly_amount = 0.0
    for donat in donats.order_by(models.TransactionDonation.created_at.asc()):
        customer_weekly_amount += donat.donat_amount
    return round(customer_weekly_amount, 2)


def send_notification(customer, message):
    push_service = FCMNotification(api_key=Config.FCM_SERVER_KEY)
    result = push_service.notify_single_device(registration_id=customer.device_token,
                                               message_body=message,
                                               message_icon='static/logo.png',
                                               sound='Default')
    logger.info(f"send_notification. result: {result}")


def create_charity(data):
    charity = models.Charity(
        name=data['name'],
        business_name=data['business_name'],
        details=data.get('details'),
        email=data['email'],
        pwd_hash=data['password'],
        type='CHARITY',
        category_id=data['category_id'],
        plan_id=data['plan_id'],
        abn=data['abn'],
        is_acnc=data['is_acnc'],
        logo=data.get('logo', None),
        image=data.get('image', None),
        stripe_custom_account_id=data['stripe_custom_account_id'],
        stripe_customer_id=data['stripe_customer_id'])
    db.session.add(charity)
    db.session.commit()

    bank_account = models.BankAccount(
        charity_id=charity.id,
        name=data['bank_name'],
        bsb=data['bank_bsb'][-3:],
        number=data['bank_account'][-4:])
    db.session.add(bank_account)
    db.session.commit()

    card = models.Card(
        user_id=charity.id,
        number=f"**** {data['card_number'][-4:]}",
        name=data['card_holder'],
        cvc=f"**{data['card_cvc'][-1]}" if data.get('card_cvc') else None,
        expiration=data['card_expiration'],
        stripe_card_id=data['stripe_card_id'])
    db.session.add(card)
    db.session.commit()

    return charity


def update_charity_card(charity, data):
    """
    For Stripe we just create a new card.
    """
    account_id = payment.create_customer(
        email=charity.email, name=charity.name, user_type='charity')
    success, result = payment.add_card(account_id, data, user_type='charity')
    if success:
        charity.stripe_customer_id = account_id
        card = models.Card(
            user_id=charity.id,
            number=f"**** {data['card_number'][-4:]}",
            name=data['card_holder'],
            cvc=f"**{data['card_cvc'][-1]}" if data.get('card_cvc') else None,
            expiration=data['card_expiration'],
            stripe_card_id=result.id)
        db.session.add(card)
        db.session.commit()
        return True, None
    return False, result


def update_charity_bank(charity, data):
    success, result = payment.update_bank_account(
        charity.stripe_custom_account_id, data)
    if success:
        bank_account = models.BankAccount(
            charity_id=charity.id,
            name=data['bank_name'],
            bsb=data['bank_bsb'][-3:],
            number=data['bank_account'][-4:])
        db.session.add(bank_account)
        db.session.commit()
        return True, None
    return False, result


def update_charity_settings(charity, data):
    for key, value in data.items():
        if key == 'image' and value == '':
            value = None
        setattr(charity, key, value)
    db.session.commit()


def upload_file(file, extension, content_type):
    if extension:
        filename = f"{uuid4().hex}.{extension}"
    else:
        filename = uuid4().hex
    s3 = boto3.resource(
        's3',
        region_name=Config.S3_REGION,
        aws_access_key_id=Config.S3_KEY,
        aws_secret_access_key=Config.S3_SECRET)
    bucket = s3.Bucket(Config.S3_BUCKET)
    bucket.put_object(
        Body=file,
        Key=filename,
        ContentType=content_type)
    img_url = f"https://{Config.S3_BUCKET}.s3.amazonaws.com/{filename}"
    return img_url


def create_donats(customer):
    logger.info('create_donats started...')
    today = datetime.now().date()
    transactions = basiq.get_transactions(customer.bq_user_id, today, today)  # for 1 day
    logger.info(f'customer: {customer} | transactions: {transactions}')
    for transaction in transactions:
        donat = models.TransactionDonation.query.filter_by(bq_transaction_id=transaction['id']).first()
        if not donat:
            logger.info('donat not found')
            amount = float(transaction['amount'].replace('-', ''))
            donat_amount = round(math.ceil(amount) - amount, 2)
            weekly_donations = get_weekly_donations(customer)
            logger.info(f'customer: {customer} | weekly_donations: {weekly_donations}')
            if weekly_donations + donat_amount >= customer.weekly_goal:  # check weekly goal limit
                logger.info(f'weekly_donations + donat_amount >= customer.weekly_goal + 0.5 is True')
                if customer.weekly_goal < 200 and customer.weekly_notification:
                    logger.info('customer.weekly_goal < 200')
                    msg = 'The weekly goal has been achieved, you can increase it in the settings.'
                    send_notification(customer, msg)
                    customer.weekly_notification = False
                    db.session.commit()
                break  # stop ineration through transactions and exit
            if weekly_donations < customer.weekly_goal:
                try:
                    donat = models.TransactionDonation(
                        customer_id=customer.id,
                        donat_amount=donat_amount,
                        bq_transaction_id=transaction['id'],
                        bq_amount=amount,
                        bq_postDate=transaction['postDate'],
                        bq_description=transaction['description'],
                        bq_title=transaction['description'])  # get title from Enrich api
                    db.session.add(donat)
                    db.session.commit()
                except:
                    pass
    logger.info('create_donats completed...')


def charge_customer(customer):
    charities = [cust_char.charity
                 for cust_char in customer.charities if cust_char.is_active]
    if len(charities) == 0:
        return False
    weekly_amount = get_weekly_donations(customer, only_unpaid=True)
    if weekly_amount > 1 and payment.charge_customer(customer, weekly_amount):
        store = [0] * len(charities)
        donats = models.TransactionDonation.query.filter_by(
            customer_id=customer.id,
            charity_id=None,
            weekly_donation_id=None).all()
        for donat in donats:
            index = store.index(min(store))
            donat.charity_id = charities[index].id
            store[index] += donat.donat_amount
            db.session.commit()


def transfer_from_customer(customer):
    charities = [cust_char.charity for cust_char in customer.charities if cust_char.is_active]
    if len(charities) == 0:
        return False
    weekly_amount = get_weekly_donations(customer, True)
    # minimal donaition is 2$ by charity
    if weekly_amount < len(charities) * 2.0:
        weekly_amount = len(charities) * 2.0
    summ_amount = 0.0
    for index, charity in enumerate(charities, 1):
        if index == len(charities):
            donat_amount = round(weekly_amount - summ_amount, 2)
        else:
            donat_amount = round(weekly_amount / len(charities), 2)
            summ_amount += donat_amount
        logger.info(f"transfer_from_customer: From {customer.id} to {charity.id} amount: {donat_amount}")
        payment_id = payment.transfer_to_charity(customer, charity, donat_amount)
        if payment_id:
            transfer_donat = models.TransferDonation(
                customer_id=customer.id,
                charity_id=charity.id,
                donat_amount=donat_amount,
                stripe_transfer_id=payment_id,
                status=models.TransferStatus.NEW
            )
            db.session.add(transfer_donat)
            db.session.commit()


def pay_charity(charity):
    donats = models.TransactionDonation.query.filter_by(
        charity_id=charity.id,
        weekly_donation_id=None).all()
    logger.info(f"charity: {charity} | donats: {donats}")
    weekly_amount = 0
    for donat in donats:
        weekly_amount += donat.donat_amount
    logger.info(f"charity: {charity} | weekly_amount: {weekly_amount}")
    if weekly_amount > 1:
        payment_id = payment.payout_to_charity(charity, round(weekly_amount, 2))
        logger.info(f"charity: {charity} | payment_id: {payment_id}")
        if payment_id:
            weekly_donat = models.WeeklyDonation(
                charity_id=charity.id,
                amount=round(weekly_amount, 2),
                stripe_transfer_id=payment_id)
            db.session.add(weekly_donat)
            db.session.commit()
            for donat in donats:
                donat.weekly_donation_id = weekly_donat.id
                db.session.commit()


def sort_by_date(donats):
    data = {}
    for donat in donats:
        date = donat.bq_postDate.strftime('%Y-%m-%d')
        trans_data = {
            'description': donat.bq_description,
            'amount': donat.bq_amount,
            'donat_amount': donat.donat_amount}
        if date in data:
            data[date].append(trans_data)
        else:
            data.update({date: [trans_data]})
    return data


def check_abn(abn):
    url = f"https://abr.business.gov.au/ABN/View?id={abn}"
    response = requests.request("GET", url)
    is_abn, is_acnc = False, False
    if response.status_code == 200:
        if 'ABN details ' in response.text:
            is_abn = True
        if 'ACNC registration' in response.text:
            is_acnc = True
    return is_abn, is_acnc


class MyImageUploadInput(ImageUploadInput):
    # class created for removing endpoint='static' when images is displayed in form
    def get_url(self, field):
        filename = field.thumbnail_fn(field.data)
        return urljoin(field.base_path, filename)


class S3ImageUploadField(ImageUploadField):
    # As flask-admin don't allow to save files to S3, this class fix that
    widget = MyImageUploadInput()

    def _save_file(self, data, filename):
        extension = filename.split('.')[-1] if '.' in filename else None
        data.seek(0)
        savedUrl = upload_file(data, extension, data.content_type)
        return savedUrl


def list_thumbnail(view, context, model, name):
    if getattr(model, name):
        return Markup(
            f'<img height="100" width="100" src="{getattr(model, name)}">')
    return ''


def list_logos(view, context, model, name):
    if getattr(model, name):
        return Markup(
            f'<img height="50" width="100" src="{getattr(model, name)}">')
    return ''


def get_thumbgen(filename):
    return filename


def sum_weekly_donations(charity_id, all_time=False):
    # get sum of all weekly donations to charity
    if not all_time:  # get first day of the month
        start_date = datetime.today().replace(day=1)
    else:  # get any day of 2000
        start_date = datetime.today().replace(year=2000)
    # old method donation
    weekly_donations = models.WeeklyDonation.query.filter(
        models.WeeklyDonation.charity_id == charity_id,
        models.WeeklyDonation.created_at >= start_date)
    sum = 0
    for weekly_donation in weekly_donations:
        sum += weekly_donation.amount
    # new method donations
    transfer_donations = models.TransferDonation.query.filter(
        models.TransferDonation.charity_id == charity_id,
        models.TransferDonation.created_at >= start_date
    )
    for transfer_donation in transfer_donations:
        sum += transfer_donation.donat_amount
    return round(sum, 2)


def convert_to_png(link):
    svg_response = requests.request("GET", link)
    if svg_response.status_code == 200:
        bytes_png = svg2png(bytestring=svg_response.content)
        savedUrl = upload_file(bytes_png, 'png', 'image/png')
        return savedUrl
    return None


def update_institutions():
    basiq_institutions = basiq.get_institutions()
    if basiq_institutions:
        # banks = models.BasiqInstitution.query.all()
        for institution in basiq_institutions:
            bank = models.BasiqInstitution.query.filter_by(
                bank_id=institution['id']).first()
            if not bank:
                try:
                    institution['bank_id'] = institution['id']
                    institution['link'] = institution['links']['self']
                    institution['logo'] = convert_to_png(
                        institution['logo']['links']['full'])
                    bank = models.BasiqInstitution(**institution)
                    models.db.session.add(bank)
                    models.db.session.commit()
                except:
                    pass


def get_charities(customer, charities):
    # get all charities
    # and set some charities as selected
    selected = set()
    if customer.charities:
        for customer_charity in customer.charities:
            if customer_charity.is_active:
                selected.add(customer_charity.charity.id)
    gold = []
    silver = []
    bronze = []
    for charity in charities:
        charity_data = {
            'id': charity.id,
            'name': charity.name,
            'logo': charity.logo,
            'is_selected': True if charity.id in selected else False}
        if charity.plan.name.strip() == 'Gold':  # What we do here is sort charities by plan
            gold.append(charity_data)
        elif charity.plan.name.strip() == 'Silver':
            silver.append(charity_data)
        else:
            bronze.append(charity_data)
    if len(gold) > 1:
        gold.sort(key=lambda x: x['name'])
    if len(silver) > 1:
        silver.sort(key=lambda x: x['name'])
    if len(bronze) > 1:
        bronze.sort(key=lambda x: x['name'])
    return gold + silver + bronze


def update_charities(customer, ids):
    for customer_charity in customer.charities:
        charity_id = customer_charity.charity.id
        if charity_id in ids:
            customer_charity.is_active = True
            db.session.commit()
            ids.remove(charity_id)
        else:
            customer_charity.is_active = False
            db.session.commit()
    for id_ in ids:
        link = models.CustomerCharity(
            customer_id=customer.id,
            charity_id=id_,
            is_active=True)
        db.session.add(link)
        db.session.commit()
    return True


def save_user_card(customer, card_data):
    success, result = payment.add_card(customer.stripe_customer_id, card_data)
    if success:
        card = models.Card(
            user_id=customer.id,
            number=f"**** {card_data['card_number'][-4:]}",
            name=card_data['card_holder'],
            cvc=f"**{card_data['card_cvc'][-1]}" if card_data.get('card_cvc') else None,
            expiration=card_data['card_expiration'],
            stripe_card_id=result.id)
        db.session.add(card)
        db.session.commit()
        return True, None
    return False, result


def update_customer_profile(customer, data):
    for key, value in data.items():
        setattr(customer, key, value)
        if key == 'weekly_notification':
            customer.weekly_notification = True
    db.session.commit()
    return True


def generate_xlsx(charity):
    donations = models.WeeklyDonation.query.filter_by(charity_id=charity.id)
    data = {'From': [], 'Date': [], 'Total': [], 'This month': [],
            'All time': []}
    for index, donation in enumerate(donations):
        data['From'].append('My Charity Change')
        data['Date'].append(donation.created_at.strftime('%B %d, %Y'))
        data['Total'].append(f"${donation.amount}")
        data['This month'].append(
            f"${sum_weekly_donations(charity.id)}" if index == 0 else '')
        data['All time'].append(
            f"${sum_weekly_donations(charity.id, True)}" if index == 0 else '')
    df = DataFrame(data)
    io = BytesIO()
    writer = ExcelWriter(io)
    df.to_excel(writer, sheet_name='Sheet1', index=False)
    writer.save()
    return io.getvalue()


def generate_csv(donation, new_version=False):
    # new version is direct transfer to charity stripe without mcc stripe, without WeeklyDonation
    content = [['id', 'first_name', 'last_name', 'email', 'date', 'number', 'amount']]
    if new_version:
        transactions = donation
    else:
        transactions = models.TransactionDonation.query.filter_by(
            weekly_donation=donation)
    for index, trans in enumerate(transactions, 1):
        content.append([index,
                        trans.customer.first_name,
                        trans.customer.last_name,
                        trans.customer.email,
                        trans.created_at,
                        f"MCC{1000000 + trans.id}",
                        trans.donat_amount])

    si = StringIO()
    cw = csv.writer(si)
    cw.writerows(content)

    # filename = f"donation_from_{donation.created_at.strftime('%Y-%m-%d')}.csv"
    if new_version:
        charity_name = donation[0].charity.name.replace(' ', '_')
        filename = f"Tax_reciept_{charity_name}_MCC{donation[0].charity.id}{donation[0].created_at.strftime('%d%m%Y')}_{donation[0].created_at.strftime('%d-%m-%Y')}.csv"
    else:
        charity_name = donation.charity.name.replace(' ', '_')
        filename = f"Tax_reciept_{charity_name}_MCC{donation.charity.id}{donation.created_at.strftime('%d%m%Y')}_{donation.created_at.strftime('%d-%m-%Y')}.csv"
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = f"attachment; filename={filename}"
    output.headers["Content-type"] = "text/csv"
    return output


@event.listens_for(models.Customer.pwd_hash, 'set', retval=True)
def hash_user_password(target, value, oldvalue, initiator):
    if value != oldvalue:
        return generate_password_hash(value)
    return value


@event.listens_for(models.Charity.pwd_hash, 'set', retval=True)
def hash_user_password(target, value, oldvalue, initiator):
    if value != oldvalue:
        return generate_password_hash(value)
    return value


def save_to_static(file_read):
    """
    Save proof_ID to static. It is required for stripe connect account
    """

    return filename


def generate_token(charity):
    token = uuid4().hex

    email_verification = models.EmailVerification(
        token=token,
        charity=charity)

    db.session.add(email_verification)
    db.session.commit()

    return token


def send_verification_email(charity, token):
    client = boto3.client(
        'ses',
        region_name=Config.SES_REGION,
        aws_access_key_id=Config.SES_KEY,
        aws_secret_access_key=Config.SES_SECRET)
    from_email = f"({'My Charity Change'}){Config.ADMIN_EMAIL}"
    verify_url = f'{Config.DOMAIN_BACKEND}/api/v1/verification/{token}'
    response = client.send_email(
        Source=from_email,
        Destination={'ToAddresses': [charity.email]},
        Message={
            'Subject': {'Data': 'My Charity Change email verification'},
            'Body': {
                'Text': {'Data': f'Please verify your email: {verify_url}'},
                'Html': {
                    'Data': render_template('charity_verify_email.jinja2', verify_url=verify_url)}
            }
        }
    )

    # msg = MIMEMultipart()
    # msg['From'] = Config.ADMIN_EMAIL
    # msg['To'] = charity.email
    # msg['Subject'] = 'My Charity Change email verification'
    # msg.attach(MIMEText('Please verify your email:'))
    # msg.attach(MIMEText(''))
    # msg.attach(
    #     MIMEText(f'{Config.DOMAIN_BACKEND}/api/v1/verification/{token}'))
    # response = client.send_raw_email(RawMessage={'Data': msg.as_string()})

    if response.get('MessageId', None):
        return True

    return False


def verify_charity_email(token):
    verification = models.EmailVerification.query.filter_by(
        token=token).first()

    if not verification:
        return 'Token not found.'

    if verification.charity.is_email_verified:
        return 'Your email is already verified.'

    if verification.created_at + timedelta(days=2) < datetime.now():
        return 'Your verification token has expired, please resend it.'

    verification.charity.is_email_verified = True
    db.session.commit()
    return 'Email verified successfully.'


def send_customer_welcome_email(customer):
    client = boto3.client(
        'ses',
        region_name=Config.SES_REGION,
        aws_access_key_id=Config.SES_KEY,
        aws_secret_access_key=Config.SES_SECRET)
    from_email = f"({'My Charity Change'}){Config.ADMIN_EMAIL}"
    static_url = f'https://{Config.S3_BUCKET}.s3.amazonaws.com/static'
    response = client.send_email(
        Source=from_email,
        Destination={'ToAddresses': [customer.email]},
        Message={
            'Subject': {'Data': 'My Charity Change I Welcome'},
            'Body': {
                'Text': {'Data': 'We are thrilled to have you as an official'
                                 ' My Charity Change user'},
                'Html': {
                    'Data': render_template('customer_welcome_email4.jinja2',
                                            static_url=static_url)}
            }
        }
    )

    if response.get('MessageId', None):
        return True

    return False


def send_customer_tax_receipt_email(customer):
    client = boto3.client(
        'ses',
        region_name=Config.SES_REGION,
        aws_access_key_id=Config.SES_KEY,
        aws_secret_access_key=Config.SES_SECRET)
    msg = MIMEMultipart()
    msg['From'] = Config.ADMIN_EMAIL
    msg['To'] = customer.email
    msg['Subject'] = 'My Charity Change I Tax receipt'
    # text = 'We just wanted to say thanks for your support as a My Charity Change customer!'
    # msg.attach(MIMEText(text, 'plain'))
    html = render_template('customer_thank_you_email.jinja2')
    msg.attach(MIMEText(html, 'html'))
    report, report_name = utils.generate_customer_tax_receipt(customer)
    attachment = MIMEApplication(report.getvalue())
    attachment.add_header('Content-Disposition', 'attachment',
                          filename=report_name)
    attachment.add_header('Content-Type', 'application/vnd.ms-excel; charset=UTF-8')
    msg.attach(attachment)

    response = client.send_raw_email(RawMessage={'Data': msg.as_string()})

    if response.get('MessageId', None):
        logger.info(f"send_customer_tax_receipt_email:. Email was sent to {customer.email}")
        return True

    return False


def send_weekly_report_email(email):
    client = boto3.client(
        'ses',
        region_name=Config.SES_REGION,
        aws_access_key_id=Config.SES_KEY,
        aws_secret_access_key=Config.SES_SECRET)
    msg = MIMEMultipart()
    msg['From'] = Config.ADMIN_EMAIL
    msg['To'] = email
    msg['Subject'] = 'My Charity Change I WEEKLY SUMMARY OF TOTAL DONATIONS AND TRANSACTIONS (BY CHARITY)'
    text = 'WEEKLY SUMMARY OF TOTAL DONATIONS AND TRANSACTIONS (BY CHARITY)'
    msg.attach(MIMEText(text, 'plain'))
    report, report_name = utils.generate_weekly_report()
    attachment = MIMEApplication(report.getvalue())
    attachment.add_header('Content-Disposition', 'attachment',
                          filename=report_name)
    attachment.add_header('Content-Type', 'application/vnd.ms-excel; charset=UTF-8')
    msg.attach(attachment)

    print('send_weekly_report_email')
    response = client.send_raw_email(RawMessage={'Data': msg.as_string()})

    if response.get('MessageId', None):
        logger.info(f"send_weekly_report_email:. Email was sent to {email}")
        return True

    return False
