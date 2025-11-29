from ..client_management import Client_Management
import time

class Session_Cleaner:
    @staticmethod
    def clean(active_clients: dict):
        while True:
            time.sleep(60)
            now = time.time()
            for ip in list(active_clients):
                user = active_clients[ip]
                if now - user["start_time"] >= user["total_time"]:
                    Client_Management.revoke_client(ip)