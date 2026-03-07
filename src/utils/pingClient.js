import { exec } from "child_process";

export function pingClient(ip) {
    return new Promise((resolve) => {
        exec(`ping -c 3 -W 1 ${ip}`, (err) => {
            if (err) {
                resolve(false); // unreachable
            } else {
                resolve(true); // reachable
            }
        });
    });
}