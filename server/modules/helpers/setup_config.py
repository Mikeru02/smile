from dotenv import load_dotenv
import subprocess
import os

load_dotenv()

router_main_interface = os.getenv("ROUTER_MAIN_INTERFACE", "eth0")
router_secondary_interface = os.getenv("ROUTER_SECONDARY_INTERFACE", "enxec9a0c1bee94")
router_address = os.getenv("ROUTER_ADDRESS", "192.168.10.1")
port = os.getenv("PORT", 80)
tcp_port = os.getenv("TCP_PORT", 80)
udp_port = os.getenv("UDP_PORT", 53)

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
            ["sudo", "iptables", "-t", "nat", "-A", "PREROUTING", "-i", router_secondary_interface, "-p", "tcp", "-dport", tcp_port, "-j", "DNAT", "--to-destination", f"{router_address}:{port}"],
            ["sudo", "iptables", "-t", "nat", "-A", "PREROUTING", "-i", router_secondary_interface, "-p", "udp", "-dport", udp_port, "-j", "DNAT", "--to-destination", f"{router_address}"],
            ["sudo", "iptables", "-t", "nat", "-A", "POSTROUTING", "-o", router_main_interface, "-j", "MASQUERADE"],
            ["sudo", "iptables", "-A", "FORWARD", "-i", router_secondary_interface, "-j", "DROP"],
            ["sudo", "iptables", "-A", "FORWARD", "-i", router_secondary_interface, "-d", router_address, "-j", "ACCEPT"],
            ["sudo", "iptables", "-A", "FORWARD", "-i", router_secondary_interface, "-p", "udp", "--dport", udp_port, "-d", router_address, "-j", "ACCEPT"]

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
            