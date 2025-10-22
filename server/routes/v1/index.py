from flask import Blueprint
# TODO: Add the router modules here.
from .splash import splash_router

v1 = Blueprint("v1", __name__)

v1.register_blueprint(splash_router, url_prefix="/splash")