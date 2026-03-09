import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export default async function backupWorker() {
    const loopInterval = 60; // check every 60 seconds
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: { 'Content-Type': 'application/json', 'apikey': process.env.SRC_KEY }
    });

    const freqMap = {
        hourly: 1,        // hours
        daily: 24,
        weekly: 24 * 7,
        monthly: 24 * 30
    };

    const backupLoop = async () => {
        try {
            // Fetch settings
            const settingsResponse = await axiosClient.get(`setting/`, {
                headers: {
                    'token': jwt.sign({ role: "admin" }, process.env.API_SECRET_KEY, { expiresIn: "1m" })
                }
            });

            const settings = settingsResponse.data.data[0];
            console.log("DEBUG SETTING", settings);

            if (!settings.auto_backup) return;

            // Ensure backup folder exists
            if (!fs.existsSync(settings.location)) fs.mkdirSync(settings.location, { recursive: true });

            const now = new Date();

            // Find the latest backup file
            const backupFiles = fs.readdirSync(settings.location)
                .filter(f => f.endsWith(".sql") || f.endsWith(".sql.zip") || f.endsWith(".sql.tar.gz"))
                .sort();

            const lastBackupFile = backupFiles.pop();

            if (lastBackupFile) {
                const lastBackupDate = fs.statSync(path.join(settings.location, lastBackupFile)).mtime;
                const diffHours = (now - lastBackupDate) / (1000 * 60 * 60); // ms → hours
                const requiredHours = freqMap[settings.backup_freq] || 24;

                if (diffHours < requiredHours) {
                    console.log(`Skipping backup. Last backup was ${diffHours.toFixed(2)} hours ago.`);
                    return;
                }
            }

            // Create SQL dump
            const timestamp = now.toISOString().replace(/[:.]/g, "-");
            const dumpFile = path.join(settings.location, `backup-${timestamp}.sql`);
            await new Promise((resolve, reject) => {
                const command = `mysqldump -u root -p${process.env.DB_PASS} ${process.env.DB_NAME} > ${dumpFile}`;
                exec(command, (err) => err ? reject(err) : resolve());
            });

            // Compress if needed
            if (settings.compression === "zip") {
                const zipFile = `${dumpFile}.zip`;
                await new Promise((resolve, reject) => {
                    exec(`zip ${zipFile} ${dumpFile}`, (err) => {
                        if (err) return reject(err);
                        fs.unlinkSync(dumpFile);
                        resolve();
                    });
                });
            } else if (settings.compression === "tar") {
                const tarFile = `${dumpFile}.tar.gz`;
                await new Promise((resolve, reject) => {
                    exec(`tar -czf ${tarFile} ${dumpFile}`, (err) => {
                        if (err) return reject(err);
                        fs.unlinkSync(dumpFile);
                        resolve();
                    });
                });
            }

            // Cleanup old backups
            const retentionMs = settings.retention * 24 * 60 * 60 * 1000;
            const files = fs.readdirSync(settings.location);
            files.forEach(file => {
                const filePath = path.join(settings.location, file);
                const stats = fs.statSync(filePath);
                if ((now - stats.mtime) > retentionMs) fs.unlinkSync(filePath);
            });

            console.log(`Backup completed at ${now.toISOString()}`);

        } catch (err) {
            console.error("Backup Worker Error:", err);
        } finally {
            setTimeout(backupLoop, loopInterval * 1000);
        }
    };

    setTimeout(backupLoop, loopInterval * 1000);
}