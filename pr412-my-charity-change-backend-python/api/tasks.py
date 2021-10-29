import time
from datetime import datetime, timedelta

import pytz
from flask_apscheduler import APScheduler

from api import basiq, handlers, models, payment
from api.models import db
from config import Config

scheduler = APScheduler()

"""
Some asynchronous repeated tasks here
"""


# @scheduler.task(
#     'interval',
#     id='purchase_charity_plan',
#     minutes=30,
#     misfire_grace_time=900,
#     max_instances=1)
@scheduler.task('cron',
                id='purchase_charity_plan',
                day_of_week='tue',
                hour=5,
                # hour=13,
                timezone=pytz.utc,
                misfire_grace_time=900,
                max_instances=1)
def purchase_charity_plan():
    with scheduler.app.app_context():
        charities = models.Charity.query.all()
        for charity in charities:
            if charity.plan and 'trial' not in charity.plan.name.lower() and charity.plan.price > 1:
                result = payment.charge_charity_plan(charity)
                charity.is_active = result
                db.session.commit()
                time.sleep(3)
                # if not charity.last_plan_payment:  # if first payment, do it in 3 days
                #     if charity.created_at + timedelta(days=3) < datetime.now():
                #         payment.charge_charity_plan(charity)
                #         time.sleep(3)
                # else:  # if regular payment, do it every 7 days
                #     if charity.last_plan_payment + timedelta(days=7) < datetime.now():
                #         payment.charge_charity_plan(charity)
                #         time.sleep(3)


@scheduler.task('interval',
                id='refresh_connections',
                hours=5,
                misfire_grace_time=900,
                max_instances=1)
def refresh_connections():
    # what is it?
    with scheduler.app.app_context():
        print('Start refresh_connections task')
        customers = models.Customer.query.all()
        for customer in customers:
            if customer.bq_user_id:
                basiq.refresh_connections(customer.bq_user_id)
                time.sleep(3)
        print('End refresh_connections task')


@scheduler.task('interval',
                id='update_transactions',
                hours=1,
                misfire_grace_time=900)
# @scheduler.task(
#     'interval',
#     id='update_transactions',
#     minutes=350,
#     misfire_grace_time=900,
#     max_instances=1)
def update_donation_transactions():
    # check customer activity and create donats
    with scheduler.app.app_context():
        customers = models.Customer.query.all()
        for customer in customers:
            if customer.bq_user_id:
                handlers.create_donats(customer)
                time.sleep(3)


@scheduler.task('cron',
                id='pay_donations',
                day_of_week='thu',
                hour=5,
                # hour=14,
                timezone=pytz.utc,
                misfire_grace_time=900,
                max_instances=1)
def pay_donations():
    # transfer money from customer to charity
    print('Start pay_donations')
    with scheduler.app.app_context():
        transfers = models.TransferDonation.query.filter_by(status='NEW')
        for transfer in transfers:
            transfer.status = models.TransferStatus.LAST
        db.session.commit()
        customers = models.Customer.query.all()
        for customer in customers:
            handlers.transfer_from_customer(customer)
            customer.weekly_notification = True
            time.sleep(3)
        db.session.commit()
    print('End pay_donations')
    # charge money from customers by Thursdays
    # with scheduler.app.app_context():
    # customers = models.Customer.query.all()
    # for customer in customers:
    #     handlers.charge_customer(customer)
    #     time.sleep(3)


# @scheduler.task('cron',
#                 id='send_donations',
#                 day_of_week='fri',
#                 hour=5,
#                 timezone=pytz.utc,
#                 misfire_grace_time=900,
#                 max_instances=1)
def send_donations():
    # send money to Charities by Fridays
    with scheduler.app.app_context():
        charities = models.Charity.query.all()
        for charity in charities:
            if charity.plan and 'trial' not in charity.plan.name.lower():
                handlers.pay_charity(charity)
                time.sleep(3)


# @scheduler.task(
#     'interval',
#     id='update_institutions',
#     hours=1,
#     misfire_grace_time=900,
#     max_instances=1)
def update_institutions():
    # it is disabled right now - we don't need to update institutions
    # there are some issues with RAB bank: it duplicates and its logo should be added by hands
    # update institutions from basiq.io api
    with scheduler.app.app_context():
        handlers.update_institutions()


@scheduler.task(
    'interval',
    id='send_tax_receipt',
    minutes=20,
    misfire_grace_time=900,
    max_instances=1,
    coalesce=True)
def send_tax_receipt():
    # send email with tax_receipt to customer
    with scheduler.app.app_context():
        customers = models.Customer.query.filter(models.Customer.send_tax_reciept == True)
        for customer in customers:
            customer.send_tax_reciept = False
            db.session.commit()
            handlers.send_customer_tax_receipt_email(customer)
            time.sleep(3)


@scheduler.task('cron',
                id='send_weekly_report',
                day_of_week='fri',
                hour=5,
                timezone=pytz.utc,
                misfire_grace_time=900,
                max_instances=1)
def send_weekly_report():
    # send email WEEKLY SUMMARY OF TOTAL DONATIONS AND TRANSACTIONS
    print('Start send_weekly_report')
    with scheduler.app.app_context():
        if Config.WEEKLY_REPORT:
            handlers.send_weekly_report_email('admin@mycharitychange.com.au')
    print('End send_weekly_report')
