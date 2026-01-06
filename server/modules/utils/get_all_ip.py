import subprocess

def get_all_ip(ignore_ips=["192.168.10.1", "127.0.0.1"]):
    result = subprocess.run(
        ["hostname", "-I"],
        capture_output=True,
        text=True
    )
    ips = result.stdout.strip().split()

    filtered_ips = [ip for ip in ips if ip not in ignore_ips]

    return filtered_ips