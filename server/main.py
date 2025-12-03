from modules.helpers.service_checker import Service
from modules.helpers.setup_config import SETUP
from modules.helpers.git_checker import GIT
from dotenv import load_dotenv
import os

load_dotenv()

port=80
host="192.168.10.1"

if __name__ == "__main__":
    """
    if os.getenv("RUN_MAIN") == "true":
        # Check and restart the services needed
        services = ["dnsmasq", "NetworkManager"]
        for service in services:
            print(f"Checking service [{service}]")
            check = Service.check(service)
            if check == False:
                print(f"Service [{service}] is down. Restarting...")
                restart = Service.restart(service)
                print(f"Service [{service}] is {restart}")
        
        # Setup the configuation of iptables and conntrack
        print("Setting up iptables configuration...")
        SETUP.flush()
        SETUP.set()

        # Check fo updates in the repository
        print("Fetching current updates...")
        git_result = GIT.fetch()
        if git_result:
            GIT.pull()
    """
    # Import updated app here
    from app import app

    app.run(host=host, port=port, debug=True)
