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

    const recentAccesses = new Map(); // key: `${clientIP}-${domain}`, value: timestamp


    const processTail = spawn("tail", ["-F", logFilePath], {
        stdio: ["ignore", "pipe", "pipe"]
    });

    const rl = createInterface({ input: processTail.stdout });

    rl.on("line", async (line) => {
        if (!line.includes("query[A]")) return;

        const match = line.match(/query\[A\]\s+([^\s]+)\s+from\s+([^\s]+)/);
        if (!match) return;

        const domain = match[1];
        const clientIP = match[2];

        if (clientIP === "127.0.0.1") return; // skip localhost

        if (!domain.startsWith("www.")) return;

        const key = `${clientIP}-${domain}`;
        const now = Date.now();
        const lastTime = recentAccesses.get(key) || 0;

        if (now - lastTime < 5000) return;

        recentAccesses.set(key, now);

        // Generate a fresh JWT for each request
        const token = jwt.sign({ role: "admin" }, process.env.API_SECRET_KEY, { expiresIn: "1m" });

        try {
            await axios.post(
                `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/link/accessed-link`,
                { clientIP, domain },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.SRC_KEY,
                        "token": token
                    }
                }
            );
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