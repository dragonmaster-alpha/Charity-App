from logging.config import dictConfig

import flask_s3

from api import create_app

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://sys.stdout',
        'formatter': 'default',

    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = create_app()

flask_s3.create_all(app, put_bucket_acl=False)


if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'])
