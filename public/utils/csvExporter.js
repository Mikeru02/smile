export default class CSVExporter {

    static convert(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return "";
        }

        const headers = Object.keys(data[0]);

        const escapeValue = (value) => {
            if (value === null || value === undefined) return "";
            return `"${String(value).replace(/"/g, '""')}"`;
        };

        const rows = data.map(row =>
            headers.map(header => escapeValue(row[header])).join(",")
        );

        return [
            headers.join(","),
            ...rows
        ].join("\n");
    }

    static download(data, filename = "export.csv") {
        const csv = this.convert(data);

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

}