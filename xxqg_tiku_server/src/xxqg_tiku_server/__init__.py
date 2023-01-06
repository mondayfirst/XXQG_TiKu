__version__ = "2.0.0"
from flask import Flask


def create_app(config:dict=None):
    app = Flask(__name__)
    if config is not None:
        app.config.update(config)
    with app.app_context():
        from .apis import bp_tiku
        app.register_blueprint(bp_tiku)
    return app
