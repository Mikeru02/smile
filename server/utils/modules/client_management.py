from server.config.config import config as global_config
import subprocess

import time

class Client_Management:
    @staticmethod
    def allow_client(ip):
        subprocess.run(["iptables", "-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"])
        subprocess.run(["iptables", "-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"])
        subprocess.run(["iptables", "-I", "FORWARD", "-s", ip, "-j", "ACCEPT"])
        subprocess.run(["iptables", "-I", "FORWARD", "-d", ip, "-j", "ACCEPT"])
        subprocess.run(["iptables", "-t", "nat", "-I", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"])

    @staticmethod
    def revoke_client(ip):
        subprocess.run(["iptables", "-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"])
        subprocess.run(["iptables", "-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"])
        subprocess.run(["iptables", "-D", "FORWARD", "-s", ip, "-j", "ACCEPT"])
        subprocess.run(["iptables", "-D", "FORWARD", "-d", ip, "-j", "ACCEPT"])
        subprocess.run(["iptables", "-t", "nat", "-D", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"])
        subprocess.run(["conntrack", "-D", "-s", ip])
        subprocess.run(["conntrack", "-D", "-d", ip])

    @staticmethod
    def session_cleaner(active_clients: dict):
        while True:
            time.sleep(60)
            now = time.time()
            for ip in list(active_clients):
                user = active_clients[ip]
                if now - user["start_time"] >= user["total_time"]:
                    print(f"[-] Revoking access for {ip}")
                    #Client_Management.revoke_client(ip)