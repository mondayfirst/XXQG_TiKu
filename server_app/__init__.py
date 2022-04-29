from flask import Flask


def create_app(config_dict=None):
    app = Flask(__name__)
    if config_dict is not None:
        app.config.update(config_dict)
    with app.app_context():
        from .views import tiku
        app.register_blueprint(tiku)

    return app
