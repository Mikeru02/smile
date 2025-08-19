from flask import Blueprint, render_template

admin_router = Blueprint("admin_router", __name__)

@admin_router.route("/")
def login_page():
    return render_template("admin/admin.html")
