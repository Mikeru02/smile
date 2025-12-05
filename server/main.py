from modules.helpers.service_checker import Service
from modules.helpers.setup_config import SETUP
from modules.helpers.git_checker import GIT
from dotenv import load_dotenv

load_dotenv()

port=80
host="192.168.10.1"

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
    
    # Run the main app if the all checks are true
    if not failed_checks:
        print("All checks passed. Starting app...")
        from app import app
        app.run(host=host, port=port, debug=True)
    else:
        print("The following checks failed...")
        for failure in failed_checks:
            print("\t", failure)
