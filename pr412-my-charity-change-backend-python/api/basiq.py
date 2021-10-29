import time
from datetime import datetime

import requests
from flask import current_app

from api.models import BasiqToken, db

"""
The module for requests to basiq.io api
"""


def get_bearer_headers():
    token = BasiqToken.query.first()
    if not token:
        token = BasiqToken('')
        db.session.add(token)
        db.session.commit()

    bearer_headers = {
        'Authorization': f"Bearer {token.access_token}",
        'Content-Type': 'application/json'
    }
    return bearer_headers


def refresh_token():
    url = 'https://au-api.basiq.io/token'
    basic_headers = {
        'Authorization': f"Basic {current_app.config['BASIQ_API_KEY']}",
        'Content-Type': 'application/x-www-form-urlencoded',
        'basiq-version': '2.0'
    }
    response = requests.request("POST", url, headers=basic_headers)
    current_app.logger.info(f'refresh_token. Status: {response.status_code}')
    if response.status_code == 200:
        new_token = response.json()['access_token']
        current_token = BasiqToken.query.first()
        if current_token:
            current_token.access_token = new_token
            current_token.created_at = datetime.now()
        else:
            new_token = BasiqToken(access_token=new_token)
            db.session.add(new_token)
        db.session.commit()
    time.sleep(1)


def register_bq_user(email):
    url = 'https://au-api.basiq.io/users'
    data = {'email': email}
    response = requests.request("POST", url, json=data,
                                headers=get_bearer_headers())
    if response.status_code == 403:
        refresh_token()
        response = requests.request("POST", url, json=data,
                                    headers=get_bearer_headers())
    if response.status_code == 201:
        return response.json()['id']
    current_app.logger.error(f'register_bq_user. Error for email: {email}')
    return None


def create_connection(customer, serializer):
    current_app.logger.info(f'create_connection. Start for {customer.id}: {customer.email}')
    url = f"https://au-api.basiq.io/users/{customer.bq_user_id}/connections"
    data = {
        'loginId': serializer['loginId'],
        'password': serializer['password'],
        'institution': {
            'id': serializer['bank_id']}}
    if serializer.get('secondaryLoginId', None):
        data['secondaryLoginId'] = serializer['secondaryLoginId']
    if serializer.get('securityCode', None):
        data['securityCode'] = serializer['securityCode']
    response = requests.request("POST", url, json=data,
                                headers=get_bearer_headers())
    if response.status_code == 403:
        refresh_token()
        response = requests.request("POST", url, json=data,
                                    headers=get_bearer_headers())
    if response.status_code == 202:
        job_url = response.json()['links']['self']
        seconds = 0
        while True:
            job = requests.request("GET", url=job_url,
                                   headers=get_bearer_headers())
            for step in job.json()['steps']:
                if step['status'] == 'success':
                    customer.bq_connection_id = step['result']['url'].split('/')[-1]
                    db.session.commit()
                    return True, ''
                if step['status'] == 'failed':
                    current_app.logger.error(f"create_connection. Step error for {customer.id}: {step}")
                    return False, step['result']['detail']
            time.sleep(7)
            seconds += 7
            if seconds >= 115:
                current_app.logger.error(f"create_connection. Time out for {customer.id}: {job.json()['steps']}")
                result = f"Sorry, the bank is not responding. Go back to the app and try again."
                return False, result
    current_app.logger.error(f"create_connection. Error for {customer.id}: {response.json()['data']}")
    return False, response.json()['data'][0]['detail']


def get_transactions(bq_user_id, from_date, to_date):
    filters = [
        # f"transaction.postDate.eq('{date}')",
        f"transaction.postDate.bt('{from_date}','{to_date}')",
        # f"transaction.postDate.gt('{from_date}')",
        "transaction.status.eq('posted')",
        "transaction.direction.eq('debit')",
        "transaction.class.eq('payment')"]
    url = f"https://au-api.basiq.io/users/{bq_user_id}/transactions?filter={','.join(filters)}"
    response = requests.request("GET", url, headers=get_bearer_headers())

    if 400 < response.status_code <= 403:
        refresh_token()
        response = requests.request("GET", url, headers=get_bearer_headers())
    if response.status_code == 200:
        return response.json()['data']  # return transactions
    current_app.logger.error(f'get_transactions. Basiq response error: {response.json()}')
    return []


def refresh_connections(bq_user_id):
    url = f"https://au-api.basiq.io/users/{bq_user_id}/connections/refresh"
    response = requests.request("POST", url, headers=get_bearer_headers())
    if response.status_code == 403:
        refresh_token()
        response = requests.request("POST", url, headers=get_bearer_headers())
    if response.status_code == 202:
        return True
    current_app.logger.error(f'refresh_connections. Error for: {bq_user_id}')
    return False


def get_title(description):
    url = f"https://au-api.basiq.io/enrich?q={description}"
    response = requests.request("GET", url, headers=get_bearer_headers())
    if response.status_code == 403:
        refresh_token()
        response = requests.request("GET", url, headers=get_bearer_headers())
    if response.status_code == 200:
        return response.json()['merchant']['businessName']  # return name
    return ''


def get_institutions():
    url = "https://au-api.basiq.io/institutions?filter=institution.country.eq('Australia')"
    response = requests.request("GET", url, headers=get_bearer_headers())
    if response.status_code == 403:
        refresh_token()
        response = requests.request("GET", url, headers=get_bearer_headers())
    if response.status_code == 200:
        return response.json()['data']  # return institutions list
    return []
