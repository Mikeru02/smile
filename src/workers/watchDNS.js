import axios from "axios";
import jwt from "jsonwebtoken";
import { spawn } from "child_process";
import { createInterface } from "readline";

export default function watchDnsmasq(logFilePath) {
    if (!logFilePath) {
        console.error("dnsmasq log path is undefined.");
        return;
    }

    console.log(`Watching ${logFilePath} (tail -F mode)...`);

    // Map to track recent client-domain accesses to prevent duplicates
    const recentAccesses = new Map(); // key: `${clientIP}-${domain}`, value: timestamp

    // Spawn tail process
    const processTail = spawn("tail", ["-F", logFilePath], {
        stdio: ["ignore", "pipe", "pipe"]
    });

    // Use readline for clean line-by-line processing
    const rl = createInterface({ input: processTail.stdout });

    rl.on("line", async (line) => {
        if (!line.includes("query[A]")) return;

        const match = line.match(/query\[A\]\s+([^\s]+)\s+from\s+([^\s]+)/);
        if (!match) return;

        const domain = match[1];
        const clientIP = match[2];

        if (clientIP === "127.0.0.1") return; // skip localhost

        const key = `${clientIP}-${domain}`;
        const now = Date.now();
        const lastTime = recentAccesses.get(key) || 0;

        // Debounce: skip if less than 5 seconds since last POST for same client/domain
        if (now - lastTime < 5000) return;

        recentAccesses.set(key, now);

        // Generate a fresh JWT for each request
        const token = jwt.sign({ role: "admin" }, process.env.API_SECRET_KEY, { expiresIn: "1m" });

        try {
            await axios.post(
                `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/admin/accessed-link`,
                { clientIP, domain },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.SRC_KEY,
                        "token": token
                    }
                }
            );
            console.log(`Logged accessed link: ${clientIP} -> ${domain}`);
        } catch (err) {
            console.error("Error posting accessed link:", err.message);
        }
    });

    processTail.stderr.on("data", (err) => {
        console.error("dnsmasq watcher error:", err.toString());
    });

    processTail.on("close", (code) => {
        console.error("dnsmasq watcher exited with code:", code);
    });
}