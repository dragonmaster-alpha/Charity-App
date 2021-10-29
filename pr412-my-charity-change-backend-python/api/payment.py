from datetime import datetime

import stripe

from api.models import db
from config import Config
from flask import current_app

"""
Customer:
- reg customer as stripe user
- add card for basiq transactions and for payments
"""

card_params_bind = {
    'exp_month': 'card_expiration',
    'exp_year': 'card_expiration',
    'number': 'card_number',
    'cvc': 'card_cvc'
}

bank_params_bind = {
    'external_account[routing_number]': 'bank_bsb',
    'external_account[account_number]': 'bank_account'
}


def upload_file(filename):
    """
    Upload photo to Stripe, as it is essential.
    """
    stripe.api_key = Config.STRIPE_SECRET_KEY
    with open(f"{Config.BASEDIR}/api/static/{filename}", "rb") as fp:
        upload = stripe.File.create(
            purpose="identity_document",
            file=fp)
    return upload.id


def create_customer(email=None, name=None, user_type='customer'):
    """
    Create Customer in Stripe to keep cards.
    """
    if user_type == 'charity':
        stripe.api_key = Config.STRIPE_SECRET_KEY_FOR_PLAN
    else:
        stripe.api_key = Config.STRIPE_SECRET_KEY
    if email and name:
        customer = stripe.Customer.create(email=email, name=name)
    else:
        customer = stripe.Customer.create()
    return customer.id


def add_card(stripe_customer_id, data, user_type='customer'):
    """
    Add card to customer. It uses only to pay donations.
    """
    if user_type == 'charity':
        stripe.api_key = Config.STRIPE_SECRET_KEY_FOR_PLAN
    else:
        stripe.api_key = Config.STRIPE_SECRET_KEY
    if len(stripe.api_key) > 50:
        try:
            card_token = stripe.Token.create(
                card={
                    "number": data['card_number'],
                    'name': data.get('card_holder', ''),
                    "exp_month": data['card_expiration'].split('/')[0],
                    'exp_year': data['card_expiration'].split('/')[1],
                    'cvc': data['card_cvc'] if data.get('card_cvc') else None
                },
            )
            card = stripe.Customer.create_source(
                stripe_customer_id,
                source=card_token
            )
        except Exception as e:
            print(e)
            if hasattr(e, 'param') and e.param in card_params_bind:
                return False, {card_params_bind[e.param]: [e.args[0]]}
            return False, {'card': ['Invalid card details.']}
    else:
        try:
            card = stripe.Customer.create_source(
                stripe_customer_id,
                source={
                    'object': 'card',
                    'number': data['card_number'],
                    'name': data.get('card_holder', ''),
                    'exp_month': data['card_expiration'].split('/')[0],
                    'exp_year': data['card_expiration'].split('/')[1],
                    'cvc': data['card_cvc'] if data.get('card_cvc') else None
                }
            )
            # return True, card
        except Exception as e:
            if hasattr(e, 'param') and e.param in card_params_bind:
                return False, {card_params_bind[e.param]: [e.args[0]]}
            return False, {'card': ['Invalid card details.']}

    # test payment
    print('Card create')
    try:
        charge = stripe.Charge.create(
            amount=100,  # $1
            currency='AUD',
            capture=False,
            customer=stripe_customer_id,
            source=card.id,
            description='Init payment.'
        )
        return True, card
    except Exception as e:
        if hasattr(e, 'param') and e.param in card_params_bind:
            return False, {card_params_bind[e.param]: [e.args[0]]}
        return False, {'card': ['Invalid card details.']}


"""
Charity:
- reg charity as custom account + 
- add bank account for payouts (with simple validation)
- use bank account for payments
"""


def add_external_card(acct, data):
    """
    Add external card to custom account. It uses for charities plan payments.
    """
    stripe.api_key = Config.STRIPE_SECRET_KEY
    try:
        card = stripe.Account.create_external_account(
            acct,
            external_account={
                'object': 'card',
                'number': data['card_number'],
                'exp_month': data['card_expiration'].split('/')[0],
                'exp_year': data['card_expiration'].split('/')[1],
                'cvc': data['card_cvc'] if data.get('card_cvc') else None
            }
        )
        return True, card.id
    except Exception as e:
        return False, e.args[0]


def reg_stripe_custom_account(data):
    """
    Register Stripe custom account for Charity.
    """
    stripe.api_key = Config.STRIPE_SECRET_KEY
    _file = upload_file('matthew.jpg')
    try:
        account = stripe.Account.create(
            country='AU',
            type='custom',
            requested_capabilities=['card_payments', 'transfers'],
            email=data['email'],
            business_type='individual',
            default_currency='AUD',
            individual={
                'first_name': 'Matthew Peter',
                'last_name': 'Hogan',
                'email': data['email'],
                'phone': '+61480028895',
                'address': {
                    'city': 'Sydney',
                    'state': 'New South Wales',
                    'line1': '123 Fake st.',
                    'line2': '',
                    'postal_code': '2000'
                },
                'dob': {
                    'day': '26',
                    'month': '07',
                    'year': '1956'
                },
                'verification': {
                    'document': {
                        'front': _file
                    },
                    'additional_document': {
                        'front': _file
                    }
                }
            },
            business_profile={
                'mcc': '8099',
                'url': 'mcc-org-web-dev.appelloproject.xyz'
            },
            tos_acceptance={
                'date': int(datetime.now().timestamp()),
                'ip': '3.222.227.234'
            },
            external_account={
                'object': 'bank_account',
                'country': 'AU',
                'currency': 'AUD',
                'routing_number': data['bank_bsb'].replace('-', '').replace(' ', ''),
                'account_number': data['bank_account'],
                'default_for_currency': True
            },
            settings={
                'payouts': {
                    'schedule': {
                        'delay_days': 2,
                        'interval': 'weekly',
                        'weekly_anchor': 'tuesday'
                    },
                }
            }
        )
        # import time
        # time.sleep(120)
        # success, result = add_external_card(account.id, data)
        return True, account
        # stripe.Account.delete(account.id)
        # return False, result
    except Exception as e:
        if hasattr(e, 'param') and e.param in bank_params_bind:
            return False, {bank_params_bind[e.param]: [e.args[0]]}
        return False, {'bank': ['Invalid bank details.']}


def update_bank_account(custom_account_id, data):
    """
    Update Charity's bank account info. Replace.
    """
    stripe.api_key = Config.STRIPE_SECRET_KEY
    try:
        customer = stripe.Account.modify(
            custom_account_id,
            external_account={
                'object': 'bank_account',
                'country': 'AU',
                'currency': 'AUD',
                'routing_number': data['bank_bsb'].replace('-', '').replace(' ', ''),
                'account_number': data['bank_account'],
                'default_for_currency': True
            }
        )
        return True, None
    except Exception as e:
        if hasattr(e, 'param') and e.param in bank_params_bind:
            return False, {bank_params_bind[e.param]: [e.args[0]]}
        return False, {'bank': ['Invalid bank details.']}


def charge_charity_plan(charity):
    """
    Charge from Charity for the plan subscription.
    """
    stripe.api_key = Config.STRIPE_SECRET_KEY_FOR_PLAN
    price = charity.plan.price
    cards = charity.cards
    if price > 0:
        if len(cards) > 0:
            try:
                payment = stripe.Charge.create(
                    amount=int(price * 100),
                    currency='AUD',
                    # source=charity.stripe_custom_account_id,
                    customer=charity.stripe_customer_id,
                    source=cards[-1].stripe_card_id,
                    description=f'Payment for {charity.plan.name} plan.'
                )
            except stripe.error.StripeError as e:
                current_app.logger.error(f"charge_charity_plan. Stripe error: {e.json_body['error']['message']}")
                return False
            if payment.status == 'succeeded':
                charity.last_plan_payment = datetime.now()
                db.session.commit()
                return True
        return False
    charity.last_plan_payment = datetime.now()
    db.session.commit()
    return True


def charge_customer(customer, amount):
    """
    Charge money from customer.
    """
    stripe.api_key = Config.STRIPE_SECRET_KEY

    if not customer.cards:
        return False  # This situation is impossible, but anyway
    try:
        charge = stripe.Charge.create(
            amount=int(amount * 100),
            currency='AUD',
            customer=customer.stripe_customer_id,
            source=customer.cards[-1].stripe_card_id,
            description='Payment for donations.'
        )
    except Exception as e:
        print(e.args[0])
        return False

    if charge.status == 'succeeded':
        return True
    return False


def payout_to_charity(charity, amount):
    """
    Send money to Charity.
    """

    stripe.api_key = Config.STRIPE_SECRET_KEY
    if not charity.bankAccounts:  # impossible situation, but anyway
        return 'False'
    try:
        transfer = stripe.Transfer.create(
            amount=int(amount * 100),
            destination=charity.stripe_custom_account_id,
            currency="AUD"
        )
        return transfer.id
    except Exception as e:
        print(e.args[0])
        return False
    return False


def transfer_to_charity(customer, charity, amount):
    """
    transfer money from customer to charity
    """
    stripe.api_key = Config.STRIPE_SECRET_KEY
    try:
        print(f"Transfer from {customer.stripe_customer_id} to {charity.stripe_custom_account_id}")
        transfer = stripe.Charge.create(
            amount=int(amount * 100),
            currency="AUD",
            description=f'Donation from {customer.first_name} {customer.last_name}',
            customer=customer.stripe_customer_id,
            source=customer.cards[-1].stripe_card_id,
            transfer_data={
                'destination': charity.stripe_custom_account_id,
            }
        )
        return transfer.id
    except stripe.error.StripeError as e:
        current_app.logger.error(f"transfer_to_charity. Stripe error: {e.json_body['error']['message']}")
        return False
    except IndexError:
        current_app.logger.error(f"transfer_to_charity. Card for payment not found")
        return False
    return False


def update_customer(customer_id, user_type='customer', name='', email=''):
    if user_type == 'charity':
        stripe.api_key = Config.STRIPE_SECRET_KEY_FOR_PLAN
    else:
        stripe.api_key = Config.STRIPE_SECRET_KEY
    if email or name:
        try:
            stripe.Customer.modify(
                customer_id,
                email=email,
                name=name
            )
        except Exception as e:
            return False
    return True
