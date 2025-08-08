from flask import Blueprint, request, current_app
from utils.modules.client_management import Client_Management
from utils.modules.clients import Clients
import time

active_clients = Clients.active_clients
pending_clients = Clients.pending_clients
active_droppers = Clients.active_droppers

splash_router = Blueprint("splash_router", __name__)

@splash_router.route("/earned")
def earned():
    ip = request.remote_addr
    seconds = pending_clients.get(ip, 0)
    return {"seconds": seconds, "minutes": seconds // 60}

@splash_router.route("/authenticate", methods=["POST"])
def authenticate():
    ip = request.remote_addr
    earned_time = pending_clients.get(ip, 0)

    if earned_time == 0:
        return "<p>You must drop a bottle or plastic waste to gain access.</p>"

    Client_Management.allow_client(ip)
    active_clients[ip] = {
        "start_time": time.time(),
        "total_time": earned_time
    }

    pending_clients.pop(ip, None)
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
    ip = request.remote_addr
    Clients.active_droppers.add(ip)
    print(f"[Drop] {ip} is ready to drop.")
    return '', 204
