# Main Script Application for S.M.I.L.E.

# Libraries and modules used
from flask import Flask, redirect
from config.config import config as global_config
from utils.modules.file_handler import Open_File
from utils.modules.cleaner import Session_Cleaner
from utils.modules.clients import Clients
from routes.v1.index import v1
import threading

# Storage for clients
active_clients = Clients.active_clients
pending_clients = Clients.pending_clients

# Instance of the flask application
app = Flask(__name__)

# Registers the route of /v1
app.register_blueprint(v1, url_prefix='/v1')

# Inject clients data
v1.active_clients = active_clients
v1.pending_clients = pending_clients

# Loading of the configuration file
config_file = Open_File("server/smile.conf")

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def redirect(path):
    return redirect("/v1/splash/")

if __name__ == '__main__':
    # Global Configuration Application
    global_config = config_file.execute()

    threading.Thread(target=Session_Cleaner.clean, args=(active_clients,), daemon=True).start()
    app.run(host=global_config["HOST"], port=global_config["PORT"])