import logging

import connexion
import sentry_sdk
from flask_cors import CORS
from flask_s3 import FlaskS3
from sentry_sdk.integrations.flask import FlaskIntegration

logger = logging.getLogger("root")


def create_app():
    # app = Flask(__name__)
    app = connexion.App(__name__, specification_dir='')
    app.add_api('spec.yaml')
    app = app.app
    app.config.from_object('config.Config')
    s3 = FlaskS3()
    from api.admin import basic_auth, admin
    from api.models import db, ma, migrate
    from api.routes import jwt, api_bp
    from api.tasks import scheduler

    logging.basicConfig(level=logging.INFO)

    CORS(app)
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    basic_auth.init_app(app)
    admin.init_app(app)
    s3.init_app(app)

    scheduler.init_app(app)
    scheduler.start()

    app.register_blueprint(api_bp)

    sentry_sdk.init(
        dsn="https://9e9a59ec6f294b7abf56bef0495c46bf@sentry.io/2844593",
        integrations=[FlaskIntegration()])

    return app
