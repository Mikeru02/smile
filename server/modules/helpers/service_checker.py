import subprocess

class Service:
    @staticmethod
    def check(service:str) -> bool:
        try:
            result = subprocess.run(
                ["systemctl", "is-active", service],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if result.stdout.strip() == "active":
                return True
            else:
                return False
        except Exception as error:
            print("<ERR> [service_checker.py](func check): ", error)
            return False
        
    @staticmethod
    def restart(service: str) -> bool:
        try:
            result = subprocess.run(
                ["systemctl", "restart", service],
                stdout=subprocess.PIPE,
                stdin=subprocess.PIPE,
                text=True
            )

            if result.returncode == 0:
                return True
            else:
                return False
        except Exception as error:
            print("<ERR> [service_checker.py](func restart): ", error)
            return False