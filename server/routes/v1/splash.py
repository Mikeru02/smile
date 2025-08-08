from flask import Blueprint, request, current_app
from utils.modules.client_management import Client_Management
import time

splash_router = Blueprint("splash_router", __name__)

@splash_router.route("/earned")
def earned():
    v1_blueprint = current_app.blueprints['v1']
    pending_users = v1_blueprint.pending_clients

    ip = request.remote_addr
    seconds = pending_users.get(ip, 0)
    return {"seconds": seconds, "minutes": seconds // 60}

@splash_router.route("/authenticate")
def authenticate():
    v1_blueprint = current_app.blueprints['v1']
    active_clients = v1_blueprint.active_clients
    pending_users = v1_blueprint.pending_clients
    active_droppers = v1_blueprint.active_droppers

    ip = request.remote_addr
    earned_time = pending_users.get(ip, 0)

    if earned_time == 0:
        return "<p>You must drop a bottle or plastic waste to gain access.</p>"

    Client_Management.allow_client(ip)
    active_clients[ip] = {
        "start_time": time.time(),
        "total_time": earned_time
    }

    pending_users.pop(ip, None)
    active_droppers.discard(ip)  # Stop adding more time after authentication

    return '''
    <html>
    <head><title>Thank You</title>
    <script>setTimeout(() => window.close(), 5000);</script>
    </head>
    <body>
        <h3>✅ You now have internet access!</h3>
        <p>Enjoy your earned time. This window will close shortly.</p>
    </body>
    </html>
    '''

@splash_router.route("/start_drop", methods=["POST"])
def start_drop():
    v1_blueprint = current_app.blueprints['v1']
    active_droppers = v1_blueprint.active_droppers
    
    ip = request.remote_addr
    active_droppers.add(ip)
    print(f"[Drop] {ip} is ready to drop.")
    return '', 204