import subprocess

def get_all_ip():
    result = subprocess.run(
        ["hostname", "-I"],
        capture_output=True,
        text=True
    )
    return result.stdout.strip().split()