from app import app, config_file, arduino, DROP_CREDITS
from .modules.utils.clients import Clients
from .modules.utils.background_process.session_cleaner import Session_Cleaner
from .modules.utils.background_process.arduino_listener import Arduino_Lister
import threading

if __name__ == '__main__':
    global_config = config_file

    threading.Thread(target=Session_Cleaner.clean, args=(Clients.active_clients,), daemon=True).start()
    threading.Thread(target=Arduino_Lister.listen, args=(arduino, DROP_CREDITS, Clients.active_droppers, Clients.pending_clients), daemon=True).start()
    app.run(host=global_config["HOST"], port=global_config["PORT"])
