from modules.helpers.service_checker import Service
from modules.helpers.setup_config import SETUP
from modules.helpers.git_checker import GIT
from modules.arduino.arduino_module import Arduino
from dotenv import load_dotenv
import os

load_dotenv()

# port=80
# router_address="192.168.10.1"

port = os.getenv("PORT", 80)
host = os.getenv("HOST", "0.0.0.0")
serial_port = os.getenv("SERIAL_PORT", "/dev/ttyACM0")
serial_speed = os.getenv("SERIAL_SPEED", 9600)
serial_timeout = os.getenv("SERIAL_TIMEOUT", 1)

if __name__ == "__main__":
    failed_checks = []

    # Check fo updates in the repository
    print("Fetching current updates...")
    git_check = False
    git_result = GIT.fetch()
    if git_result:
        GIT.pull()
        git_check = True
    if not git_check:
        failed_checks.append("Git update failed!")
    
    # Check and restart the services needed
    services = ["dnsmasq", "NetworkManager"]
    service_failures = []
    for service in services:
        print(f"Checking service [{service}]")
        check = Service.check(service)
        if check == False:
            print(f"Service [{service}] is down. Restarting...")
            restart = Service.restart(service)
            if not restart:
                service_failures.append(service)
    if service_failures:
        failed_checks.append(f"Service failed: {', '.join(service_failures)}")
        
    # Setup the configuation of iptables and conntrack
    print("Setting up iptables configuration...")
    SETUP.flush()
    setup_check = SETUP.set()
    if not setup_check:
        failed_checks.append("Setup Configuration Failed!")

    print("Initializing Arduino...")
    try:
        arduino = Arduino(serial_port=serial_port, serial_speed=serial_speed, serial_timeout=serial_timeout)
        arduino_ready = True
    except Exception as error:
        arduino_ready = False
        failed_checks.append("Arduino connection failed!")
    
    # Run the main app if the all checks are true
    if not failed_checks:
        print("All checks passed. Starting app...")
        from app import app
        app.config["arduino"] = arduino
        app.run(host=host, port=port, debug=True)
    else:
        print("The following checks failed...")
        for failure in failed_checks:
            print("\t", failure)
