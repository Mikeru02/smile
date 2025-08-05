from flask import Flask, request
import subprocess
import threading
import time
import serial

app = Flask(__name__)

# Connect to Arduino
arduino = serial.Serial("/dev/ttyACM0", 9600, timeout=1)
time.sleep(2)

# Time rewards (in seconds)
DROP_CREDITS = {
    "PLASTIC_BOTTLE": 5 * 60,
    "PLASTIC_WASTE": 3 * 60
}

# Stores authenticated users with timers
active_clients = {}

# Stores IPs and their earned time before authentication
pending_users = {}

# IPs currently in "drop mode" (clicked start button)
active_droppers = set()

# ------------------ IPTABLES ------------------

def allow_client(ip):
    subprocess.run(["iptables", "-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"])
    subprocess.run(["iptables", "-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"])
    subprocess.run(["iptables", "-I", "FORWARD", "-s", ip, "-j", "ACCEPT"])
    subprocess.run(["iptables", "-I", "FORWARD", "-d", ip, "-j", "ACCEPT"])
    subprocess.run(["iptables", "-t", "nat", "-I", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"])


def revoke_client(ip):
    subprocess.run(["iptables", "-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"])
    subprocess.run(["iptables", "-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"])
    subprocess.run(["iptables", "-D", "FORWARD", "-s", ip, "-j", "ACCEPT"])
    subprocess.run(["iptables", "-D", "FORWARD", "-d", ip, "-j", "ACCEPT"])
    subprocess.run(["iptables", "-t", "nat", "-D", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"])
    subprocess.run(["conntrack", "-D", "-s", ip])
    active_clients.pop(ip, None)


# ------------------ BACKGROUND THREADS ------------------

def session_cleaner():
    while True:
        time.sleep(60)
        now = time.time()
        for ip in list(active_clients):
            user = active_clients[ip]
            if now - user["start_time"] >= user["total_time"]:
                print(f"[-] Revoking access for {ip}")
                revoke_client(ip)


def arduino_listener():
    while True:
        if arduino.in_waiting:
            line = arduino.readline().decode().strip()
            print(f"[Arduino] {line}")
            if line in DROP_CREDITS and active_droppers:
                added = DROP_CREDITS[line]
                for ip in list(active_droppers):
                    pending_users[ip] = pending_users.get(ip, 0) + added
                    print(f"[+] {ip} earned {added // 60} minutes (Total: {pending_users[ip] // 60} min)")


# ------------------ FLASK ROUTES ------------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def splash(path):
    ip = request.remote_addr
    if ip not in pending_users:
        pending_users[ip] = 0  # Start with 0 earned time

    return '''
    <html>
    <head>
        <title>Smile WiFi</title>
        <script>
        let startedDrop = false;

        async function checkTime() {
            const res = await fetch('/earned');
            const data = await res.json();

            if (data.minutes > 0) {
                document.getElementById("earned").innerText = `✅ You've earned ${data.minutes} minutes.`;
                document.getElementById("authBtn").disabled = false;
            } else {
                if (!startedDrop) {
                    document.getElementById("earned").innerText = "🕒 Press the button below and drop a bottle/plastic.";
                } else {
                    document.getElementById("earned").innerText = "🕒 Waiting for drop input from Arduino...";
                }
                document.getElementById("authBtn").disabled = true;
            }
        }

        async function startDrop() {
            startedDrop = true;
            await fetch('/start_drop', { method: 'POST' });
            document.getElementById("earned").innerText = "🕒 Waiting for drop input from Arduino...";
        }

        setInterval(checkTime, 2000);
        window.onload = checkTime;
        </script>
    </head>
    <body>
        <h1>Welcome to Smile WiFi!</h1>
        <button onclick="startDrop()">🚮 Press Me to Start Drop</button>
        <p id="earned">🕒 Waiting...</p>
        <form action="/authenticate" method="post">
            <button id="authBtn" type="submit" disabled>Click to Get Internet</button>
        </form>
    </body>
    </html>
    '''


@app.route("/earned")
def earned():
    ip = request.remote_addr
    seconds = pending_users.get(ip, 0)
    return {"seconds": seconds, "minutes": seconds // 60}


@app.route("/start_drop", methods=["POST"])
def start_drop():
    ip = request.remote_addr
    active_droppers.add(ip)
    print(f"[Drop] {ip} is ready to drop.")
    return '', 204


@app.route("/authenticate", methods=["POST"])
def authenticate():
    ip = request.remote_addr
    earned_time = pending_users.get(ip, 0)

    if earned_time == 0:
        return "<p>You must drop a bottle or plastic waste to gain access.</p>"

    allow_client(ip)
    active_clients[ip] = {
        "start_time": time.time(),
        "total_time": earned_time
    }

    pending_users.pop(ip, None)
    active_droppers.discard(ip)  # Stop adding more time after authentication

    return '''
    <html>
    <head><title>Thank You</title>
    <script>setTimeout(() => window.close(), 5000);</script>
    </head>
    <body>
        <h3>✅ You now have internet access!</h3>
        <p>Enjoy your earned time. This window will close shortly.</p>
    </body>
    </html>
    '''


@app.route("/users")
def show_users():
    now = time.time()
    return {
        ip: int(user["total_time"] - (now - user["start_time"]))
        for ip, user in active_clients.items()
    }


# ------------------ MAIN ------------------

if __name__ == "__main__":
    threading.Thread(target=session_cleaner, daemon=True).start()
    threading.Thread(target=arduino_listener, daemon=True).start()
    app.run(host="0.0.0.0", port=80)