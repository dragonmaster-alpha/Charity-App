import os


class Config(object):
    DEBUG = False if os.environ.get('DEBUG', None) == 'False' else True
    SECRET_KEY = os.environ.get('SECRET_KEY', 'secret')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret')
    # JWT_REFRESH_TOKEN_EXPIRES = False
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    JSON_SORT_KEYS = False

    S3_KEY = os.environ.get('S3_KEY', 'AKIA5BPUFQNYXSQMJTVZ')
    S3_SECRET = os.environ.get('S3_SECRET', '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')
    S3_BUCKET = os.environ.get('S3_BUCKET', 'mcc-back-dev')
    S3_REGION = os.environ.get('S3_REGION', 'us-east-1')
    AWS_ACCESS_KEY_ID = S3_KEY
    AWS_SECRET_ACCESS_KEY = S3_SECRET
    ACL = 'public-read'
    FLASKS3_BUCKET_NAME = S3_BUCKET
    FLASKS3_REGION = S3_REGION

    SES_KEY = os.environ.get('SES_KEY', 'AKIA2NTCFYGBI2UPIZOW')
    SES_SECRET = os.environ.get('SES_SECRET', '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')
    SES_REGION = os.environ.get('SES_REGION', 'us-east-1')

    ADMIN_EMAIL = 'admin@mycharitychange.com.au'

    POSTGRES_URL = os.environ.get('POSTGRES_URL', '127.0.0.1:5432')
    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'mycharity')
    POSTGRES_PW = os.environ.get('POSTGRES_PW', 'mycharity')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', 'mycharity')

    SQLALCHEMY_DATABASE_URI = f'postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PW}@{POSTGRES_URL}/{POSTGRES_DB}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLASK_ADMIN_SWATCH = 'cerulean'

    BASIC_AUTH_USERNAME = os.environ.get('BASIC_AUTH_USERNAME', 'admin')
    BASIC_AUTH_PASSWORD = os.environ.get('BASIC_AUTH_PASSWORD', 'password')

    BASIQ_API_KEY = os.environ.get(
        'BASIQ_API_KEY',
        'MjVhYzBlNzctZWMxYS00MTQyLWIxODMtYmUyZmM0NzkxY2NiOmQzNTA0NjM1LWZiZmYtNDBkNC1iNWQ0LWQ3ZmQyMTU3NjEyNQ==')

    STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_sejLqFYXDHd9gp4LkZ5zNQr600frDqpRZV')
    STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_czh5S1ncJhkhIAPi7rhku4x4007n8AhOef')
    STRIPE_SECRET_KEY_FOR_PLAN = os.environ.get(
        'STRIPE_SECRET_KEY_FOR_PLAN', 'sk_test_51HFXA5GujKEX4QijSln4P2dDn2T73mO5GJVs2NyQM1ACBp9Dbz3ALaVk0C1e5xp67frm5ZGfttdEur7LTiyv9lRs00n90e18rL')

    SCHEDULER_EXECUTORS = {
        'default': {
            'type': 'threadpool',
            'max_workers': 1}}
    SCHEDULER_JOB_DEFAULTS = {
        'coalesce': True,
        'max_instances': 1}
    SCHEDULER_API_ENABLED = True

    FCM_SERVER_KEY = os.environ.get(
        'FCM_SERVER_KEY',
        'AAAABmpIYjs:APA91bGWRGCZQzAjkGQZpIfei5wtk_Jh8Q3kaqM31XQYolLtEIjw7XVojPS932IbfvV-GApgypA0kehz0jwjBS-ULBKdikeY7rQBUEX6-BCJSjKMfW5PvQg8QfI63t0rEBYQHNwlhUZm')

    DOMAIN_BACKEND = os.environ.get('DOMAIN_BACKEND', 'http://127.0.0.1:5000')
    DOMAIN_CHARITY = os.environ.get('DOMAIN_CHARITY', 'https://mcc-org-web-dev.appelloproject.xyz')

    WEEKLY_REPORT = os.environ.get('WEEKLY_REPORT', False)
