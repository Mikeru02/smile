# Main Script Application for S.M.I.L.E.

# Libraries and modules used
from flask import Flask, request, redirect as flask_redirect
from config.config import config as global_config
from utils.modules.file_handler import Open_File
from utils.modules.path_handler import Path_Handler
from utils.modules.background_process.session_cleaner import Session_Cleaner
from utils.modules.background_process.arduino_listener import Arduino_Lister
from utils.modules.clients import Clients
from routes.v1.index import v1
import threading
import serial

# Instance of the flask application
app = Flask(__name__, template_folder="../public")

# Registers the route of /v1
app.register_blueprint(v1, url_prefix='/v1')

# Loading of the configuration file
config_file = Open_File(Path_Handler.get("smile.conf")).execute()

# Instance the arduino
arduino = serial.Serial(config_file["SERIAL_PORT"], config_file["SERIAL_SPEED"], timeout=1)
DROP_CREDITS = {
    "PLASTIC_BOTTLE": 5 * 60,
    "PLASTIC_WASTE": 3 * 60
}

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def redirect(path):
    ip = request.remote_addr
    if path.startswith("/v1/admin"):
        return flask_redirect("/v1/admin")

    if ip not in Clients.pending_clients:
        Clients.pending_clients[ip] = 0  # Start with 0 earned time

    return '''
    <html>
    <head>
        <title>Smile WiFi</title>
        <script>
        let startedDrop = false;

        async function checkTime() {
            const res = await fetch('/v1/splash/earned');
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
            await fetch('/v1/splash/start_drop', { method: 'POST' });
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
        <form action="/v1/splash/authenticate" method="post">
            <button id="authBtn" type="submit" disabled>Click to Get Internet</button>
        </form>
    </body>
    </html>
    '''

if __name__ == '__main__':
    # Global Configuration Application
    global_config = config_file

    threading.Thread(target=Session_Cleaner.clean, args=(Clients.active_clients,), daemon=True).start()
    threading.Thread(target=Arduino_Lister.listen, args=(arduino, DROP_CREDITS, Clients.active_droppers, Clients.pending_clients), daemon=True).start()
    app.run(host=global_config["HOST"], port=global_config["PORT"])
