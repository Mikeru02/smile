import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export default class BackupWorker {
    constructor() {
        this.loopInterval = 30; // check every 60 seconds
        this.axiosClient = axios.create({
            baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
            headers: { 'Content-Type': 'application/json', 'apikey': process.env.SRC_KEY }
        });

        this.freqMap = {
            hourly: 1,        // hours
            daily: 24,
            weekly: 24 * 7,
            monthly: 24 * 30
        };
    }

    async fetchSettings() {
        const response = await this.axiosClient.get(`setting/`, {
            headers: {
                'token': jwt.sign({ role: "admin" }, process.env.API_SECRET_KEY, { expiresIn: "1m" })
            }
        });
        return response.data.data[0];
    }

    async createBackup(settings) {
        const now = new Date();
        const dumpFile = path.join(settings.location, `backup-${now.toISOString().replace(/[:.]/g, "-")}.sql`);

        await new Promise((resolve, reject) => {
            const command = `mysqldump -u root -p${process.env.DB_PASS} ${process.env.DB_NAME} > ${dumpFile}`;
            exec(command, (err) => (err ? reject(err) : resolve()));
        });

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

        console.log(`Backup completed at ${now.toISOString()}`);
    }

    cleanupOldBackups(settings) {
        const now = new Date();
        const retentionMs = settings.retention * 24 * 60 * 60 * 1000;

        fs.readdirSync(settings.location).forEach(file => {
            const filePath = path.join(settings.location, file);
            const stats = fs.statSync(filePath);
            if ((now - stats.mtime) > retentionMs) fs.unlinkSync(filePath);
        });
    }

    async backupNow() {
        const settings = await this.fetchSettings();
        if (!fs.existsSync(settings.location)) fs.mkdirSync(settings.location, { recursive: true });
        await this.createBackup(settings);
        this.cleanupOldBackups(settings);
    }

    async backupLoop() {
        try {
            const settings = await this.fetchSettings();
            console.log("DEBUG SETTING", settings);

            if (!settings.auto_backup) return;

            if (!fs.existsSync(settings.location)) fs.mkdirSync(settings.location, { recursive: true });

            const now = new Date();
            const backupFiles = fs.readdirSync(settings.location)
                .filter(f => f.endsWith(".sql") || f.endsWith(".sql.zip") || f.endsWith(".sql.tar.gz"))
                .sort();
            const lastBackupFile = backupFiles.pop();

            if (lastBackupFile) {
                const lastBackupDate = fs.statSync(path.join(settings.location, lastBackupFile)).mtime;
                const diffHours = (now - lastBackupDate) / (1000 * 60 * 60);
                const requiredHours = this.freqMap[settings.backup_freq] || 24;

                if (diffHours < requiredHours) {
                    console.log(`Skipping backup. Last backup was ${diffHours.toFixed(2)} hours ago.`);
                    return;
                }
            }

            await this.createBackup(settings);
            this.cleanupOldBackups(settings);

        } catch (err) {
            console.error("Backup Worker Error:", err);
        } finally {
            setTimeout(() => this.backupLoop(), this.loopInterval * 1000);
        }
    }

    start() {
        console.log("BackupWorker started...");
        setTimeout(() => this.backupLoop(), this.loopInterval * 1000);
    }
}