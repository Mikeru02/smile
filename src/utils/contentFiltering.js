import fs from "fs";
import runSpawnSync from "./runSpawnSync.js";

const BLOCK_FILE = "/etc/dnsmasq.d/blocked_domains.conf";

export default class ContentFiltering {
    // Add a domain (blocks all subdomains automatically)
    static addDomain(domain) {
        if (!domain) return;

        const entry = `address=/${domain}/0.0.0.0\n`;

        // Read current file
        let current = "";
        try {
            current = fs.readFileSync(BLOCK_FILE, "utf8");
        } catch (err) {
            if (err.code !== "ENOENT") throw err;
        }

        // Add if not already present
        if (!current.includes(entry.trim())) {
            fs.appendFileSync(BLOCK_FILE, entry);
            // Reload dnsmasq to apply
            runSpawnSync("systemctl", ["restart", "dnsmasq"]);
            console.log(`Blocked domain (with subdomains): ${domain}`);
        }
    }

    // Remove a domain (removes all subdomains block)
    static removeDomain(domain) {
        if (!domain) return;

        const entry = `address=/${domain}/0.0.0.0`;

        let current = "";
        try {
            current = fs.readFileSync(BLOCK_FILE, "utf8");
        } catch (err) {
            if (err.code === "ENOENT") return;
            throw err;
        }

        // Remove the line that matches the domain
        const updated = current
            .split("\n")
            .filter(line => line.trim() !== entry)
            .join("\n");

        fs.writeFileSync(BLOCK_FILE, updated);

        // Reload dnsmasq
        runSpawnSync("systemctl", ["restart", "dnsmasq"]);
        console.log(`Removed domain block (including subdomains): ${domain}`);
    }
}