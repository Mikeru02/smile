import { exec } from "child_process";

export function pingClient(ip) {
    return new Promise((resolve) => {
        // Try ping first
        exec(`ping -c 1 -W 1 ${ip}`, (pingErr) => {
            if (!pingErr) return resolve(true); // reachable via ping

            // Fallback to 'ip neigh' state
            exec(`ip neigh show ${ip}`, (neighErr, neighStdout) => {
                if (neighErr || !neighStdout) return resolve(false);

                // Consider REACHABLE or STALE as online
                if (neighStdout.includes("REACHABLE") || neighStdout.includes("STALE")) {
                    return resolve(true);
                }

                // FAILED or DELAY means unreachable
                if (neighStdout.includes("FAILED") || neighStdout.includes("DELAY")) {
                    return resolve(false);
                }

                // Fallback in case state is unknown
                resolve(false);
            });
        });
    });
}