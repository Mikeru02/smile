import axios from "axios";
import jwt from 'jsonwebtoken';
import { spawn } from "child_process";

export default function watchDnsmasq(logFilePath) {
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SRC_KEY,
            'token': jwt.sign({ 'role': role}, process.env.API_SECRET_KEY, { expiresIn: '1m' })
        }
    });

    if (!logFilePath) {
        console.error("dnsmasq log path is undefined.");
        return;
    }

    const process = spawn("tail", ["-F", logFilePath], {
        stdio: ["ignore", "pipe", "pipe"]
    });

    process.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");

        lines.forEach(async (line) => {
            if (line.includes("query[A]")) {
                const match = line.match(/query\[A\]\s+([^\s]+)\s+from\s+([^\s]+)/);
                if (match) {
                    const domain = match[1];
                    const clientIP = match[2];

                    if (clientIP !== "127.0.0.1") {
                        await axiosClient.post(
                            `admin/accessed-links`,
                            {
                                "clientIP": clientIP,
                                "domain": domain
                            }
                        )
                    }
                }
            }
        });
    });

    process.stderr.on("data", (err) => {
        console.error("dnsmasq watcher error:", err.toString());
    });

    process.on("close", (code) => {
        console.error("dnsmasq watcher exited with code:", code);
    });

    console.log(`Watching ${logFilePath} (tail -F mode)...`);
}