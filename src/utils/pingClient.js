import { exec } from "child_process";

export function pingClient(ip) {
    return new Promise((resolve) => {
        // First, try ping
        exec(`ping -c 1 -W 1 ${ip}`, (err) => {
            if (!err) {
                return resolve(true); // reachable via ping
            }

            // If ping fails, check ARP table
            exec(`arp -n ${ip}`, (arpErr, stdout) => {
                if (arpErr) {
                    return resolve(false);
                }

                // If ARP entry exists, the client is still online
                if (stdout.includes(ip)) {
                    return resolve(true);
                }

                return resolve(false); // unreachable
            });
        });
    });
}