from flask import Blueprint, request

admin_router = Blueprint("admin_router", __name__)

@admin_router.route("/")
def login_page():
    return "<h1>Admin login page</h1>"
