import json
from datetime import datetime, timedelta
from json.decoder import JSONDecodeError

import six
from flask import (Blueprint, Response, current_app, jsonify, render_template,
                   render_template_string, request)
from flask_jwt_extended import (JWTManager, create_access_token, current_user,
                                get_jwt_claims, get_jwt_identity, jwt_required)
from flask_s3 import url_for
from jose import jwt as jose_jwt
from marshmallow import pprint
from marshmallow.exceptions import ValidationError
from requests.exceptions import ConnectionError
from sqlalchemy import func, extract
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import Unauthorized
from werkzeug.security import check_password_hash, generate_password_hash

from api import basiq, payment
from config import Config

from .handlers import (check_abn, create_charity, generate_csv, generate_token,
                       get_charities, get_charity_donations,
                       get_weekly_donations, save_user_card,
                       send_verification_email, sort_by_date,
                       sum_weekly_donations, update_charities,
                       update_charity_bank, update_charity_card,
                       update_charity_settings, update_customer_profile,
                       upload_file, verify_charity_email, send_notification,
                       send_customer_welcome_email, send_customer_tax_receipt_email, send_weekly_report_email)
from .models import (BasiqInstitution, Category, Charity, Customer,
                     EmailVerification, Feature, ParentCategory, Plan,
                     TransactionDonation, User, WeeklyDonation, db, TransferDonation)
from .schemas import (BankConnectionSchema, BasiqInstitutionSchema,
                      CategorySchema, CharityBankValidationSchema,
                      CharityCardValidationSchema,
                      CharityInformationValidationSchema, CharityLoginSchema,
                      CharityRegisterSchema, CharitySchema,
                      CharityShortSettingsSchema, CharityValidationSchema,
                      CustomerCardSchema, CustomerEditProfileSchema,
                      CustomerProfileSchema, CustomerSignupSchema,
                      FeatureSchema, PlanSchema, UpdateCharitiesSchema)

jwt = JWTManager()
api_bp = Blueprint('api', __name__)


@jwt.user_loader_callback_loader
def load_user(email):
    """
    Allows to use current_user method.
    This method automatically runs for every endpoint where @jwt_required
    is placed. Todo: remove it in the future, if not every endpoint needs
    to get user object.
    """
    # current_app.logger.info(f'Load user by email: {email}')
    try:
        return Customer.query.filter_by(email=email).one()
    except NoResultFound as e:
        pass
    try:
        return Charity.query.filter_by(email=email).one()
    except NoResultFound as e:
        current_app.logger.error(f'Email not found: {email}')
        return False


@api_bp.route('/')
def home():
    return render_template('home.jinja2')


@api_bp.route('/api/v1/customer/signup', methods=['POST'])
def signup_customer():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    try:
        serializer = CustomerSignupSchema().load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400
    customer = Customer.query.filter_by(email=serializer['email']).first()
    if customer:  # if customer is exists, edit fields:
        is_match = check_password_hash(customer.pwd_hash, serializer['password'])
        if not is_match:
            return jsonify({'password': ['Wrong password']}), 400
        if not customer.bq_user_id:
            customer.bq_user_id = basiq.register_bq_user(customer.email)
        customer.first_name = serializer['first_name']
        customer.last_name = serializer['last_name']
        customer.device_token = serializer['device_token']
        db.session.commit()
        current_app.logger.info(f'Log in customer {customer.id}: {customer.email}')
    else:
        customer = Customer(
            email=serializer['email'],
            pwd_hash=serializer['password'],
            type='CUSTOMER',
            first_name=serializer['first_name'],
            last_name=serializer['last_name'],
            bq_user_id=basiq.register_bq_user(serializer['email']),
            device_token=serializer['device_token'])
        db.session.add(customer)
        db.session.commit()
        current_app.logger.info(f'New customer {customer.id}: {customer.email}')

        send_customer_welcome_email(customer)
    if not customer.stripe_customer_id:
        customer.stripe_customer_id = payment.create_customer(
            customer.email, f"{customer.first_name} {customer.last_name}")
        db.session.commit()
        current_app.logger.info(f'New stripe {customer.id}: {customer.stripe_customer_id}')
    access_token = create_access_token(
        identity=serializer['email'],
        expires_delta=timedelta(days=90),
        user_claims={'type': customer.type.value})

    return jsonify(
        access_token=access_token,
        user_id=customer.id,
        has_bank=True if customer.bq_connection_id else False,
        has_card=True if customer.cards else False,
        has_charity=True if customer.charities else False), 200


@api_bp.route('/api/v1/customer/send_report', methods=['GET'])
@jwt_required
def customer_send_report():
    current_user.send_tax_reciept = True
    db.session.commit()
    # send_customer_tax_receipt_email(current_user)
    return jsonify(message='Tax receipt will be sent within an hour.'), 200

# Only for testing

# @api_bp.route('/api/v1/customer/send_weekly_report', methods=['GET'])
# @jwt_required
# def customer_send_weekly_report():
#     send_weekly_report_email(current_user.email)
#     return jsonify(message='Report will be send'), 200


# @api_bp.route('/api/v1/customer/send_notification', methods=['post'])
# def customer_send_notification():
#     customer = Customer.query.filter(Customer.id == request.json.get('id')).first()
#     message = request.json.get('message')
#     if customer and message:
#         send_notification(customer, message)
#         return jsonify(message='Message sent.'), 200
#     return jsonify(message='Error.'), 400


@api_bp.route('/api/v1/customer/<int:user_id>/impact', methods=['GET'])
@jwt_required
def get_impact(user_id):
    current_app.logger.info(f'Impact {user_id}.')
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        current_app.logger.error(f'Impact {user_id}: Customer not found')
        return jsonify({'msg': 'Customer not found'}), 404
    data = {
        'weekly_amount': get_weekly_donations(customer),
        'all_time_amount': 0.0,
        'charities': []}
    for charity in customer.charities:
        total_charity_amount = get_charity_donations(customer, charity.charity.id)
        data['all_time_amount'] += total_charity_amount
        if charity.is_active:  # exclude inactive customer-charities
            charity_data = {
                'logo': charity.charity.logo,
                'name': charity.charity.name,
                'total_charity_amount': total_charity_amount}
            data['charities'].append(charity_data)
    return jsonify(data), 200


@api_bp.route('/api/v1/customer/<int:user_id>/cards', methods=['GET'])
@jwt_required
def get_card(user_id):
    current_app.logger.info(f'Cards get {user_id}.')
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        current_app.logger.error(f'Cards get {user_id}: Customer not found')
        return jsonify({'msg': 'Customer not found'}), 404
    if customer.cards:
        card = customer.cards[-1]
        return jsonify({
            'card_number': card.number,
            'card_holder': card.name,
            'card_expiration': card.expiration,
            'card_cvc': card.cvc,
            'id': card.id}), 200
    return jsonify({'msg': 'Customer has no cards.'})


@api_bp.route('/api/v1/customer/<int:user_id>/cards', methods=['POST'])
@jwt_required
def add_card(user_id):
    current_app.logger.info(f'Cards post {user_id}.')
    if not request.is_json:
        current_app.logger.error(f'Cards post {user_id}: Missing JSON in request')
        return jsonify({"msg": "Missing JSON in request"}), 400
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        current_app.logger.error(f'Cards post {user_id}: Customer not found')
        return jsonify({'msg': 'Customer not found'}), 404
    if not customer.stripe_customer_id:
        customer.stripe_customer_id = payment.create_customer(
            customer.email, f"{customer.first_name} {customer.last_name}")
        db.session.commit()
    try:
        serializer = CustomerCardSchema().load(request.json)
    except ValidationError as error:
        current_app.logger.error(f'Cards post {user_id}: {error.messages}')
        return jsonify(error.messages), 400
    _, error = save_user_card(customer, serializer)
    if error:
        return jsonify(error), 400
    return jsonify({'msg': 'Card added.'}), 200


@api_bp.route('/api/v1/customer/<int:user_id>/transactions', methods=['GET'])
@jwt_required
def load_transactions(user_id):
    current_app.logger.info(f'Transactions {user_id}.')
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        current_app.logger.error(f'Transactions {user_id}: Customer not found')
        return jsonify({'msg': 'Customer not found'}), 404
    try:
        page = int(request.args.get('page'))
    except:
        page = 1
    donats = TransactionDonation.query.filter_by(
        customer_id=customer.id).order_by(
            TransactionDonation.bq_postDate.desc()).paginate(page, 20, True)
    data = {'donations': sort_by_date(donats.items)}
    data['next_page'] = donats.next_num if donats.has_next else None
    data['pages'] = donats.pages
    return jsonify(data), 200


@api_bp.route('/api/v1/customer/<int:user_id>/profile', methods=['GET'])
@jwt_required
def get_profile(user_id):
    current_app.logger.info(f'Profile get {user_id}.')
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        current_app.logger.error(f'Profile get {user_id}: Customer not found')
        return jsonify({'msg': 'Customer not found'}), 404
    serializer = CustomerProfileSchema().dump(customer)
    serializer['weekly_amount'] = get_weekly_donations(customer)
    if customer.cards:
        card = customer.cards[-1]
        serializer['card'] = {'card_id': card.id, 'card_ending': card.number}
    else:
        serializer['card'] = {}
    return jsonify(serializer), 200


@api_bp.route('/api/v1/customer/<int:user_id>/profile', methods=['PUT'])
@jwt_required
def update_profile(user_id):
    current_app.logger.info(f'Profile post {user_id}.')
    if not request.is_json:
        current_app.logger.error(f'Profile post {user_id}: Missing JSON in request')
        return jsonify({"msg": "Missing JSON in request"}), 400
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        current_app.logger.error(f'Profile post {user_id}: Customer not found')
        return jsonify({'msg': 'Customer not found'}), 404
    try:
        schema = CustomerEditProfileSchema()
        schema.context['user_email'] = customer.email
        serializer = schema.load(request.json)
    except ValidationError as error:
        current_app.logger.error(f'Profile post {user_id}: {error.messages}')
        return jsonify(error.messages), 400
    # check email change
    new_email = False
    if serializer.get('email') and serializer.get('email') != customer.email:
        new_email = True
    update_customer_profile(customer, serializer)
    current_app.logger.info(f'Profile result {user_id}: {serializer}')
    # minimal donaition is 2$ by charity
    charities = [cust_char.charity for cust_char in customer.charities if cust_char.is_active]
    if customer.weekly_goal < len(charities) * 2.0:
        customer.weekly_goal = len(charities) * 2.0
        db.session.commit()
    if new_email:
        access_token = create_access_token(
            identity=customer.email,
            expires_delta=timedelta(days=90),
            user_claims={'type': customer.type.value})
        serializer['access_token'] = access_token
    return jsonify(serializer), 200


@api_bp.route('/api/v1/customer/<int:user_id>/charities', methods=['GET'])
@jwt_required
def get_customer_charities(user_id):
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        return jsonify({'msg': 'Customer not found'}), 404
    charities = Charity.query.filter(
        Charity.is_active == True, Charity.is_email_verified == True)
    if request.args.get('categories', None):
        # charities = charities.filter(Charity.category.has(Category.name.in_(request.args['category'].split(','))))
        charities = charities.join(Category).filter(Category.name.in_(request.args['categories'].split(',')))
    if request.args.get('search', None):
        charities = charities.filter(Charity.name.ilike(f"%{request.args['search']}%"))
    data = get_charities(customer, charities.all())
    return jsonify(data), 200


@api_bp.route('/api/v1/customer/<int:user_id>/charities', methods=['PUT'])
@jwt_required
def update_customer_charities(user_id):
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    customer = Customer.query.get(user_id)
    if not customer or customer.email != get_jwt_identity():
        return jsonify({'msg': 'Customer not found'}), 404
    try:
        serializer = UpdateCharitiesSchema().load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400
    update_charities(customer, serializer['charity_ids'])
    return jsonify({'msg': 'Charities updated'}), 200


@api_bp.route('/api/v1/charity/register', methods=['POST'])
def register_charity():
    # if not request.is_json:
    #     return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.json
    if not data:
        data = request.form
    try:
        serializer = CharityRegisterSchema().load(data)
    except ValidationError as error:
        return jsonify(error.messages), 400
    logo = request.files.get('logo', None)
    if not logo:
        return jsonify(logo=['Logo must be added']), 400
    else:
        extension = logo.filename.split('.')[-1].replace('"', '') if '.' in logo.filename else None
        content_type = logo.content_type
        logo_read = logo.read()
        if len(logo_read) > 10 * 1000000:
            return jsonify(logo=['Max size is 10Mb.']), 400
        serializer['logo'] = upload_file(logo_read, extension, content_type)
    image = request.files.get('image', None)
    if image:
        extension = image.filename.split('.')[-1].replace('"', '') if '.' in image.filename else None
        content_type = image.content_type
        image_read = image.read()
        if len(image_read) > 20 * 1000000:
            return jsonify(image=['Max size is 20Mb.']), 400
        serializer['image'] = upload_file(image_read, extension, content_type)
    # proof_ID = request.files.get('proof_ID', None)
    _, serializer['is_acnc'] = check_abn(serializer['abn'])
    # success, result = payment.reg_stripe_custom_account(serializer)
    # if not success:
    #     return jsonify(msg=result), 400
    # serializer['custom_account_id'] = result
    charity = create_charity(serializer)
    if charity:
        payment.update_customer(
            charity.stripe_customer_id, user_type='charity', name=charity.name, email=charity.email)
        access_token = create_access_token(
            identity=serializer['email'],
            expires_delta=timedelta(days=90),
            user_claims={'type': 'charity'})
        send_verification_email(charity, generate_token(charity))
        return jsonify(access_token=access_token, charity_id=charity.id), 200
    return jsonify(msg="Can't create charity."), 400


@api_bp.route('/api/v1/charity/login', methods=['POST'])
def login_charity():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    try:
        serializer = CharityLoginSchema().load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400
    charity = Charity.query.filter_by(email=serializer['email']).first()
    is_match = check_password_hash(charity.pwd_hash, serializer['password'])
    if is_match:
        access_token = create_access_token(
            identity=serializer['email'],
            expires_delta=timedelta(days=90),
            user_claims={'type': charity.type.value})
        return jsonify(access_token=access_token, charity_id=charity.id), 200
    else:
        return jsonify({'password': ['Wrong password']}), 400


@api_bp.route('/api/v1/charity/<int:charity_id>', methods=['GET'])
@jwt_required
def get_charity(charity_id):
    # get charity
    charity = Charity.query.get(charity_id)
    if not charity or charity.email != get_jwt_identity():
        return jsonify({'msg': 'Charity not found'}), 404
    return jsonify(CharitySchema().dump(charity)), 200


@api_bp.route('/api/v1/charity/<int:charity_id>', methods=['PUT'])
@jwt_required
def update_charity(charity_id):
    # update charity settings: bank, card, info and images
    charity = Charity.query.get(charity_id)
    if not charity or charity.email != get_jwt_identity():
        return jsonify({'msg': 'Charity not found'}), 404
    data = request.json
    if not data:  # form-data
        data = request.form.to_dict(flat=True)  # immutablemultidict to dict for .pop()
        if data.get('card', None):
            try:
                data['card'] = json.loads(data['card'])
            except JSONDecodeError:
                del data['card']
        if data.get('bank', None):
            try:
                data['bank'] = json.loads(data['bank'])
            except JSONDecodeError:
                del data['bank']
    card_serializer = None
    bank_serializer = None
    try:
        # validate data
        card = data.pop('card', None)
        if card:
            card_serializer = CharityCardValidationSchema().load(card)
        bank = data.pop('bank', None)
        if bank:
            bank_serializer = CharityBankValidationSchema(exclude=['email']).load(bank)
        logo = request.files.get('logo', None)
        if logo:
            logo_read = logo.read()
            if len(logo_read) > 10 * 1000000:
                return jsonify(logo=['Max size is 10Mb.']), 400
        image = request.files.get('image', None)
        if image:
            image_read = image.read()
            if len(image_read) > 20 * 1000000:
                return jsonify(image=['Max size is 20Mb.']), 400
        serializer = CharityShortSettingsSchema().load(data)
        # save data
        if card_serializer:
            success, result = update_charity_card(charity, card_serializer)
            if not success:
                return jsonify(result), 400
        if bank_serializer:
            success, result = update_charity_bank(charity, bank_serializer)
            if not success:
                return jsonify(result), 400
        if logo:
            logo_extension = logo.filename.split('.')[-1].replace('"', '') if '.' in logo.filename else None
            serializer['logo'] = upload_file(logo_read, logo_extension, logo.content_type)
        if image:
            image_extension = image.filename.split('.')[-1].replace('"', '') if '.' in image.filename else None
            serializer['image'] = upload_file(image_read, image_extension, image.content_type)
        update_charity_settings(charity, serializer)
        return jsonify(CharitySchema().dump(charity)), 200
    except ValidationError as error:
        return jsonify(error.messages), 400


@api_bp.route('/api/v1/charity/<int:charity_id>/dashboard', methods=['GET'])
@jwt_required
def get_dashboard(charity_id):
    # new version is direct transfer to charity stripe without mcc stripe, without WeeklyDonation
    # shows list of tranfer_donations when shows list of weekly_donations by 8 on page
    charity = Charity.query.get(charity_id)
    if not charity or charity.email != get_jwt_identity():
        return jsonify({'msg': 'Charity not found'}), 404
    try:
        all_page = int(request.args.get('page'))
    except:
        all_page = 1
    day = func.date_trunc('day', TransferDonation.created_at)
    transfer_donations = db.session.query(func.sum(TransferDonation.donat_amount).label('total'), day).\
        filter_by(charity_id=charity.id).\
        order_by(day.desc()).group_by(day).paginate(1, 8, True)
    dlist = []
    if all_page <= transfer_donations.pages:
        transfer_donations = db.session.query(func.sum(TransferDonation.donat_amount).label('total'), day).\
            filter_by(charity_id=charity.id).\
            order_by(day.desc()).group_by(day).paginate(all_page, 8, True)
        donations = WeeklyDonation.query.filter_by(
            charity_id=charity.id).order_by(
                WeeklyDonation.created_at.desc()).paginate(1, 8, True)
        for d in transfer_donations.items:
            dlist.append({
                'from': 'My Charity Change',
                'date': round(d[1].timestamp()),
                'total': d[0],
                'id': round(d[1].timestamp())})
        if transfer_donations.has_next:
            next_page = transfer_donations.next_num
        else:
            if donations.page > 0:
                next_page = transfer_donations.pages + 1
            else:
                next_page = None
    else:
        page = all_page - transfer_donations.pages
        donations = WeeklyDonation.query.filter_by(
            charity_id=charity.id).order_by(
                WeeklyDonation.created_at.desc()).paginate(page, 8, True)
        for d in donations.items:
            dlist.append({
                'from': 'My Charity Change',
                'date': round(d.created_at.timestamp()),
                'total': d.amount,
                'id': d.id})
        if donations.has_next:
            next_page = transfer_donations.pages + donations.next_num
        else:
            next_page = None
    data = {
        'donations': dlist,
        'next_page': next_page,
        'pages': transfer_donations.pages + donations.pages}
    return jsonify(data), 200


@api_bp.route('/api/v1/charity/<int:charity_id>/stats', methods=['GET'])
@jwt_required
def get_stats(charity_id):
    # shows the stats of the Charity - monthly donations and donations for all time
    charity = Charity.query.get(charity_id)
    if not charity or charity.email != get_jwt_identity():
        return jsonify({'msg': 'Charity not found'}), 404
    data = {
        'this_month_amount': sum_weekly_donations(charity_id),
        'all_time_amount': sum_weekly_donations(charity_id, True)}
    return jsonify(data), 200


@api_bp.route('/api/v1/charity/<int:charity_id>/donations/<int:donation_id>/csv', methods=['GET'])
@jwt_required
def download_csv(charity_id, donation_id):
    # download csv with donation details
    charity = Charity.query.get(charity_id)
    if not charity or charity.email != get_jwt_identity():
        return jsonify({'msg': 'Charity not found'}), 404
    donations = WeeklyDonation.query.filter_by(
        id=donation_id, charity_id=charity_id).first()
    if not donations:
        donations = TransferDonation.query.filter(
            TransferDonation.charity_id == charity_id,
            TransferDonation.created_at > datetime.fromtimestamp(donation_id) - timedelta(days=1),
            TransferDonation.created_at < datetime.fromtimestamp(donation_id) + timedelta(days=1)
        ).all()
        if not donations:
            return jsonify({'msg': 'Weekly donation not found'}), 404
        return generate_csv(donations, True)
    return generate_csv(donations)


@api_bp.route('/api/v1/charity/validation/email', methods=['POST'])
def validate_charity_email():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    try:
        serializer = CharityValidationSchema().load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400
    return jsonify(msg='Valid email and password.'), 200


@api_bp.route('/api/v1/charity/validation/information', methods=['POST'])
def validate_charity_information():
    data = request.json
    if not data:
        data = request.form
    try:
        serializer = CharityInformationValidationSchema().load(data)
    except ValidationError as error:
        return jsonify(error.messages), 400
    logo = request.files.get('logo', None)
    if logo:
        if len(logo.read()) > 10 * 1000000:
            return jsonify(logo=['Max size is 10Mb.']), 400
    image = request.files.get('image', None)
    if image:
        if len(image.read()) > 20 * 1000000:
            return jsonify(image=['Max size is 20Mb.']), 400
    is_abn, is_acnc = check_abn(serializer['abn'])
    if not is_abn:
        return jsonify(abn=['Organization not found.']), 400
    return jsonify(msg=['Valid charity information.']), 200


@api_bp.route('/api/v1/charity/validation/bank', methods=['POST'])
def validate_charity_bank():
    """
    In fact, the bank is not only validated here, but also created.
    use STRIPE_SECRET_KEY
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    try:
        serializer = CharityBankValidationSchema(
            exclude=['bank_name']).load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400
    success, result = payment.reg_stripe_custom_account(serializer)
    if not success:
        return jsonify(result), 400
    return jsonify(stripe_custom_account_id=result.id), 200


@api_bp.route('/api/v1/charity/validation/card', methods=['POST'])
def validate_charity_card():
    """
    In fact, the card is not only validated here, but also created.
    use STRIPE_SECRET_KEY_FOR_PLAN
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    try:
        serializer = CharityCardValidationSchema(
            exclude=['card_holder']).load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400
    try:
        account_id = payment.create_customer(user_type='charity')
        success, result = payment.add_card(account_id, serializer, user_type='charity')
        if not success:
            return jsonify(result), 400
        return jsonify(stripe_customer_id=account_id,
                       stripe_card_id=result.id), 200
    except:
        return jsonify(card_number=["Can't create a card."]), 400


@api_bp.route('/api/v1/verification/<string:token>', methods=['GET'])
def verify_email(token):
    # Verify token from the email
    message = verify_charity_email(token)

    return Response(render_template(
        'verify_email.jinja2', message=message, url=Config.DOMAIN_CHARITY))


@api_bp.route('/api/v1/verification/resend', methods=['GET'])
@jwt_required
def resend_verification_email():
    # Resend verification email to the Charity
    EmailVerification.query.filter_by(charity=current_user).delete()

    if current_user.is_email_verified:
        return jsonify(msg='Your email is already verified.'), 400

    if send_verification_email(current_user, generate_token(current_user)):
        return jsonify(msg='Verification email has been sent.'), 200

    return jsonify(msg="Can't send an email."), 400


@api_bp.route('/api/v1/categories', methods=['GET'])
def get_categories():
    data = {}
    parents = ParentCategory.query.all()
    for parent in parents:
        categories = CategorySchema().dump(parent.categories, many=True)
        data[parent.name] = categories
    return jsonify(data), 200


@api_bp.route('/api/v1/plans', methods=['GET'])
def get_plans():
    plans = Plan.query.order_by(Plan.id.asc()).all()
    features = Feature.query.order_by(Feature.id.asc()).all()
    return jsonify({
        'plans': PlanSchema().dump(plans, many=True),
        'features': FeatureSchema().dump(features, many=True)}), 200


@api_bp.route('/api/v1/basiq/institutions', methods=['GET'])
@jwt_required
def get_banks():
    banks = BasiqInstitution.query.filter()
    if request.args.get('tier', None):
        banks = banks.filter(BasiqInstitution.tier == request.args['tier'])
    if request.args.get('search', None):
        banks = banks.filter(BasiqInstitution.name.ilike(f"%{request.args['search']}%"))
    serializer = BasiqInstitutionSchema().dump(banks, many=True)
    return jsonify(serializer), 200


@api_bp.route('/api/v1/basiq/connections', methods=['POST'])
@jwt_required
def connect_bank():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    try:
        serializer = BankConnectionSchema().load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400
    customer = Customer.query.get(serializer['user_id'])
    if not customer or customer.email != get_jwt_identity():
        return jsonify({'msg': 'Customer not found'}), 404
    try:
        connection, error = basiq.create_connection(customer, serializer)
    except ConnectionError:
        return jsonify({'detail': 'Basiq.io API connection error. Please try in 10 minutes.'}), 400
    if error:
        return jsonify({'detail': error}), 400
    return jsonify({'msg': 'Bank added'}), 200


def decode_token(token):
    try:
        return jose_jwt.decode(token, current_app.config['JWT_SECRET_KEY'])
    except Exception as e:
        six.raise_from(Unauthorized, e)


# fix stripe customer email and name, manual start to fix
# @api_bp.route('/api/v1/fix-stripe', methods=['GET'])
# def fix_stripe():
#     print('Start')
#     import stripe
#     stripe.api_key = Config.STRIPE_SECRET_KEY
#     customers = Customer.query.all()
#     res = {}
#     for customer in customers:
#         # deleted customer
#         if customer.id == 341:
#             continue
#         if customer.stripe_customer_id:
#             try:
#                 print(customer.id)
#                 stripe.Customer.modify(
#                     customer.stripe_customer_id,
#                     email=customer.email,
#                     name=f"{customer.first_name} {customer.last_name}"
#                 )
#                 answer = stripe.Customer.retrieve(customer.stripe_customer_id)
#                 res[customer.id] = {'email': answer.get('email', '???'), 'name': answer.get('name', '???')}
#             except Exception as e:
#                 print('Error')
#                 res[customer.id] = e
#     print('Finish')
#     return jsonify(res), 200
