from flask import Blueprint
from .testing import test_router
from .splash import splash_router
from .admin import admin_router

v1 = Blueprint('v1', __name__)

v1.register_blueprint(test_router, url_prefix='/test')
v1.register_blueprint(splash_router, url_prefix='/splash')
v1.register_blueprint(admin_router, url_prefix='/admin')
