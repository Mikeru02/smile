class Arduino_Lister:
    @staticmethod
    def listen(arduino, DROP_CREDITS, active_droppers, pending_users):
        while True:
            if arduino.in_waiting:
                line = arduino.readline().decode().strip()
                print(f"[Arduino] {line}")
                print(f"Active droppers: {active_droppers}")
                if line in DROP_CREDITS and active_droppers:
                    added = DROP_CREDITS[line]
                    for ip in list(active_droppers):
                        pending_users[ip] = pending_users.get(ip, 0) + added
                        print(f"[+] {ip} earned {added // 60} minutes (Total: {pending_users[ip] // 60} min)")
