import fs from "fs";
import readline from "readline";

function watchDnsmasq(logFilePath) {
    let fileSize = 0;

    // Initialize file size
    try {
        const stats = fs.statSync(logFilePath);
        fileSize = stats.size;
    } catch (err) {
        console.error("Log file not found:", err);
        return;
    }

    fs.watch(logFilePath, async (eventType) => {
        if (eventType === "change") {
            const stats = fs.statSync(logFilePath);
            if (stats.size > fileSize) {
                const stream = fs.createReadStream(logFilePath, {
                    start: fileSize,
                    end: stats.size
                });

                const rl = readline.createInterface({ input: stream });

                rl.on("line", (line) => {
                    if (line.includes("query[A]")) {
                        const match = line.match(/query\[A\]\s+([^\s]+)\s+from\s+([^\s]+)/);
                        if (match) {
                            const domain = match[1];
                            const clientIP = match[2];
                            callback(clientIP, domain);
                        }
                    }
                });

                rl.on("close", () => {
                    fileSize = stats.size;
                });
            }
        }
    });

    console.log(`Watching ${logFilePath} for IPv4 client requests...`);
}

export default watchDnsmasq;