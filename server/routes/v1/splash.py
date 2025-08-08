from flask import Blueprint, request, current_app

splash_router = Blueprint("splash_router", __name__)

@splash_router.route("/")
def splash_page():
    v1_blueprint = current_app.blueprints['v1']
    pending_users = v1_blueprint.pending_clients

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
            const res = await fetch('/earned');
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