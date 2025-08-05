from flask import Flask, request
import subprocess
import threading
import time

app = Flask(__name__)
active_clients = {}
ALLOW_TIME = 30 * 60  # 30 minutes

def allow_client(ip):
    # Allow HTTP and DNS passthrough for this IP
    subprocess.run(["iptables", "-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"])
    subprocess.run(["iptables", "-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"])

    # Allow forwarding from and to this IP
    subprocess.run(["iptables", "-I", "FORWARD", "-s", ip, "-j", "ACCEPT"])
    subprocess.run(["iptables", "-I", "FORWARD", "-d", ip, "-j", "ACCEPT"])

    # Enable NAT for this IP
    subprocess.run(["iptables", "-t", "nat", "-I", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"])

    active_clients[ip] = time.time()
    print(f"[+] Allowed {ip} for {ALLOW_TIME} seconds.")

def revoke_client(ip):
    # Reverse everything
    subprocess.run(["iptables", "-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"])
    subprocess.run(["iptables", "-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"])
    subprocess.run(["iptables", "-D", "FORWARD", "-s", ip, "-j", "ACCEPT"])
    subprocess.run(["iptables", "-D", "FORWARD", "-d", ip, "-j", "ACCEPT"])
    subprocess.run(["iptables", "-t", "nat", "-D", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"])

    active_clients.pop(ip, None)
    print(f"[-] Revoked {ip}'s access.")

def session_cleaner():
    while True:
        time.sleep(60)
        now = time.time()
        for ip in list(active_clients):
            if now - active_clients[ip] > ALLOW_TIME:
                revoke_client(ip)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def splash(path):
    return '''
    <html>
    <head>
        <title>Smile WiFi</title>
        <script>
            // Auto-close the pop-up after successful connect
            function closeWindow() {
                setTimeout(() => window.close(), 5000);
            }
        </script>
    </head>
    <body>
        <h1>Welcome to Smile WiFi!</h1>
        <form action="/authenticate" method="post">
            <button type="submit">Click to Get Internet</button>
        </form>
    </body>
    </html>
    '''

@app.route("/authenticate", methods=["POST"])
def authenticate():
    ip = request.remote_addr
    print(f"[Request] Authentication attempt from {ip}")
    allow_client(ip)
    return '''
    <html>
    <head><title>Thank You</title>
    <script>
        setTimeout(() => window.close(), 5000);
    </script>
    </head>
    <body>
        <h3>✅ You now have internet access for 30 minutes. Enjoy!</h3>
        <p>This window will close shortly...</p>
    </body>
    </html>
    '''
@app.route("/users")
def show_users():
    return {"authenticated_users": active_clients}

if __name__ == "__main__":
    threading.Thread(target=session_cleaner, daemon=True).start()
    app.run(host="0.0.0.0", port=80)