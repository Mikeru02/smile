import axios from "axios";
import jwt from "jsonwebtoken";
import { spawn } from "child_process";
import { createInterface } from "readline";
import ignoredDomain from '../resources/ignoredDomains.js';

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

        if (ignoredDomain.some(d => domain.includes(d))) return;

        const key = `${clientIP}-${domain}`;
        const now = Date.now();
        const lastTime = recentAccesses.get(key) || 0;

        if (now - lastTime < 5000) return;

        recentAccesses.set(key, now);

        let prohibitedLinks;
        let settings;
        let client;

        // Generate a fresh JWT for each request
        const token = jwt.sign({ role: "admin" }, process.env.API_SECRET_KEY, { expiresIn: "1m" });

        try {
            const clientResponse = await axios.get(
                `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/client/?field=ip&value=${clientIP}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.SRC_KEY,
                        "token": token
                    } 
                }
            )
            client = clientResponse.data.data[0];
        }
        catch (err) {
            console.error("Error fetching client data", err.message);
        }

        try {
            const settingResponse = await axios.get(
                `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/setting/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.SRC_KEY,
                        "token": token
                    }
                }
            )
            settings = settingResponse.data.data[0];
        }
        catch (err) {
            console.error('Error fetching settings:', err.message);
        }

        try {
            const prohibitedResponse = await axios.get(
               `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/link/prohibited/all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.SRC_KEY,
                        "token": token
                    }
                } 
            )
            prohibitedLinks = prohibitedResponse.data.data;
        }
        catch (err) {
            console.error("Error getting prohibited links", err.message);
        }

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

        console.log("DEBUG DATA", {
            client: client,
            setting: settings,
            prohibited: prohibitedLinks
        })

        const isProhibited = prohibitedLinks?.some(link => domain.includes(link.link));
        console.log("DEBUG Deduct", isProhibited)
        if (isProhibited) {
            const newTimeRemaining = client.time_remaining - (settings.time_deduct * 60);
            await axios.patch(
                `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/client/?field=id&value=${client.id}`,
                { time_remaining: newTimeRemaining },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.SRC_KEY,
                        "token": token
                    }   
                }
            )
        }
    });

    processTail.stderr.on("data", (err) => {
        console.error("dnsmasq watcher error:", err.toString());
    });

    processTail.on("close", (code) => {
        console.error("dnsmasq watcher exited with code:", code);
    });
}