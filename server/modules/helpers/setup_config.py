from dotenv import load_dotenv
import subprocess
import os

load_dotenv()

router_connection_name = os.getenv("ROUTER_CONNECTION_NAME")
router_connection = os.getenv("ROUTER_CONNECTION")
router_address = os.getenv("ROUTER_ADDRESS")
port = os.getenv("PORT")
tcp_port = os.getenv("TCP_PORT")
udp_port = os.getenv("UDP_PORT")

class SETUP:
    @staticmethod
    def flush():
        commands = [
            ["iptables", "-F"],
            ["iptables", "-t", "nat", "-F"],
            ["iptables", "-X"],
            ["conntrack", "-F"]
        ]

        is_success = True

        for command in commands:
            result = subprocess.run(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if result.returncode != 0:
                is_success = False
                print("<ERR> [setup_config.py](func flush): ", result.stderr.strip())

        return is_success
            
    @staticmethod
    def set():
        commands = [
            ["iptables", "-t", "nat", "-A", "PREROUTING", "-i", router_connection, "-p", "tcp", "--dport", tcp_port, "-j", "DNAT", "--to-destination", f"{router_address}:{port}"],
            ["iptables", "-t", "nat", "-A", "PREROUTING", "-i", router_connection, "-p", "udp", "--dport", udp_port, "-j", "DNAT", "--to-destination", router_address],
            ["iptables", "-t", "nat", "-A", "POSTROUTING", "-o", "eth0", "-j", "MASQUERADE"]
        ]

        is_success = True

        for command in commands:
            result = subprocess.run(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if result.returncode != 0:
                is_success = False
                print("<ERR> [setup_config.py](func set): ", result.stderr.strip())

        return is_success
            