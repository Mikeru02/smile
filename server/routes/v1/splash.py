from flask import Blueprint, request, current_app
from utils.modules.client_management import Client_Management
import time

splash_router = Blueprint("splash_router", __name__)

v1_blueprint = current_app.blueprints['v1']
active_clients = v1_blueprint.active_clients
pending_users = v1_blueprint.pending_clients
active_droppers = v1_blueprint.active_droppers

@splash_router.route("/")
def splash_page():
    ip = request.remote_addr
    if ip not in pending_users:
        pending_users[ip] = 0  # Start with 0 earned time

    return '''
    <html>
    <head>
        <title>Smile WiFi</title>
        <script>
        let startedDrop = false;

        async function checkTime() {
            const res = await fetch('v1/splash/earned');
            const data = await res.json();

            if (data.minutes > 0) {
                document.getElementById("earned").innerText = `✅ You've earned ${data.minutes} minutes.`;
                document.getElementById("authBtn").disabled = false;
            } else {
                if (!startedDrop) {
                    document.getElementById("earned").innerText = "🕒 Press the button below and drop a bottle/plastic.";
                } else {
                    document.getElementById("earned").innerText = "🕒 Waiting for drop input from Arduino...";
                }
                document.getElementById("authBtn").disabled = true;
            }
        }

        async function startDrop() {
            startedDrop = true;
            await fetch('/start_drop', { method: 'POST' });
            document.getElementById("earned").innerText = "🕒 Waiting for drop input from Arduino...";
        }

        setInterval(checkTime, 2000);
        window.onload = checkTime;
        </script>
    </head>
    <body>
        <h1>Welcome to Smile WiFi!</h1>
        <button onclick="startDrop()">🚮 Press Me to Start Drop</button>
        <p id="earned">🕒 Waiting...</p>
        <form action="/authenticate" method="post">
            <button id="authBtn" type="submit" disabled>Click to Get Internet</button>
        </form>
    </body>
    </html>
    '''

@splash_router.route("/earned")
def earned():
    ip = request.remote_addr
    seconds = pending_users.get(ip, 0)
    return {"seconds": seconds, "minutes": seconds // 60}

@splash_router.route("/authenticate")
def authenticate():
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