import fs from 'fs';

export default class CSVExporter {
    static convert(data) {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array of objects');
        }

        if (data.length === 0) {
            return "";
        }

        const headers = Object.keys(data[0]);
        const escapeValue = (value) => {
            if (value === null || value === undefined) {
                return "";
            }

            const stringValue = String(value);

            return `"${stringValue.replace(/"/g, '""')}"`;
        };

        const rows = data.map(row => {
            return headers.map(header => {
                return escapeValue(row[header]);
            }).join(",");
        });

        const csv = [
            headers.join(","),
            ...rows
        ].join("\n");

        return csv;
    }

    static save(filePath, data) {
        const csv = this.convert(data);
        fs.writeFileSync(filePath, csv, "utf8");
    }
}