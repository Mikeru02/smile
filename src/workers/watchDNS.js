import axios from "axios";
import jwt from "jsonwebtoken";
import { spawn } from "child_process";

export default function watchDnsmasq(logFilePath) {
    if (!logFilePath) {
        console.error("dnsmasq log path is undefined.");
        return;
    }

    console.log(`Watching ${logFilePath} (tail -F mode)...`);

    const recentAccesses = new Map();
    let buffer = "";

    const processTail = spawn("tail", ["-F", logFilePath]);

    processTail.stdout.on("data", async (chunk) => {
        buffer += chunk.toString();

        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
            try {
                if (!line.includes("query[A]")) continue;

                const match = line.match(/query\[A\]\s+([^\s]+)\s+from\s+([^\s]+)/);
                if (!match) continue;

                const domain = match[1];
                const clientIP = match[2];

                if (clientIP === "127.0.0.1") continue;
                if (!domain.startsWith("www.")) continue;

                const key = `${clientIP}-${domain}`;
                const now = Date.now();
                const lastTime = recentAccesses.get(key) || 0;

                if (now - lastTime < 5000) continue;

                recentAccesses.set(key, now);

                const token = jwt.sign(
                    { role: "admin" },
                    process.env.API_SECRET_KEY,
                    { expiresIn: "1m" }
                );

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

                console.log(`Logged: ${clientIP} -> ${domain}`);
            } catch (err) {
                console.error("Watcher processing error:", err.message);
            }
        }
    });

    processTail.stderr.on("data", (err) => {
        console.error("dnsmasq watcher error:", err.toString());
    });

    processTail.on("close", (code) => {
        console.error("dnsmasq watcher exited with code:", code);
    });
}