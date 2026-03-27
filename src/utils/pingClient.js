import { exec } from "child_process";

export function pingClient(ip) {
    return new Promise((resolve) => {
        exec(`ping -c 1 -W 1 ${ip}`, (pingErr) => {
            if (!pingErr) return resolve(true);

            exec(`ip neigh show ${ip}`, (neighErr, neighStdout) => {
                if (neighErr || !neighStdout) return resolve(false);

                // Look only at the AP interface
                const lines = neighStdout.split("\n");
                const targetInterface = "enxec9a0c1bee94"; // AP interface
                for (const line of lines) {
                    if (line.includes(targetInterface)) {
                        if (line.includes("REACHABLE") || line.includes("STALE")) {
                            return resolve(true);
                        }
                        if (line.includes("FAILED") || line.includes("DELAY")) {
                            return resolve(false);
                        }
                    }
                }

                resolve(false); // fallback
            });
        });
    });
}