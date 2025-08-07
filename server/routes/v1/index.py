from flask import Blueprint
from .testing import test_router

v1 = Blueprint('v1', __name__)

v1.register_blueprint(test_router, url_prefix='/test')