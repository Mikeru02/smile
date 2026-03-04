import axios from "axios";
import jwt from 'jsonwebtoken';
import { spawn } from "child_process";

export default function watchDnsmasq(logFilePath) {
    if (!logFilePath) {
        console.error("dnsmasq log path is undefined.");
        return;
    }

    // Create axiosClient here, after process.env is ready
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SRC_KEY,
            'token': jwt.sign({ 'role': 'admin'}, process.env.API_SECRET_KEY, { expiresIn: '1m' })
        }
    });

    const processTail = spawn("tail", ["-F", logFilePath], {
        stdio: ["ignore", "pipe", "pipe"]
    });

    processTail.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");

        lines.forEach(async (line) => {
            if (line.includes("query[A]")) {
                const match = line.match(/query\[A\]\s+([^\s]+)\s+from\s+([^\s]+)/);
                if (match) {
                    const domain = match[1];
                    const clientIP = match[2];

                    if (clientIP !== "127.0.0.1") {
                        await axiosClient.post(
                            `admin/accessed-link`,
                            { clientIP, domain }
                        );
                    }
                }
            }
        });
    });

    processTail.stderr.on("data", (err) => {
        console.error("dnsmasq watcher error:", err.toString());
    });

    processTail.on("close", (code) => {
        console.error("dnsmasq watcher exited with code:", code);
    });

    console.log(`Watching ${logFilePath} (tail -F mode)...`);
}