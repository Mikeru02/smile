import fs from "fs";

/**
 * Get MAC and hostname from dnsmasq leases for a given IP
 * 
 * @param {string} ip - IP address to lookup
 * @param {string} leasesFile - optional path to dnsmasq.leases
 * 
 * @returns {{mac: string, hostname: string}|null} Object with MAC and hostname or null if not found
 */
export default function getLeaseInfo(ip, leaseFile = "/var/lib/misc/dnsmasq.leases") {
    try {
        const normalizedIP = ip.replace("::ffff:","");

        const data = fs.readFileSync(leaseFile, "utf-8");
        const lines = data.split("\n");

        for (const line of lines) {
            if (!line.trim()) continue;

            const parts = line.split(/\s+/);
            const [leaseTime, mac, leaseIp, hostname] = parts;

            if (leaseIp === normalizedIP) {
                return { mac, hostname }
            }
        }

        return null;
    }
    catch (err) {
        console.error("[ERROR] Error reading dnsmasq leases:", err);
        throw err;
    }
}