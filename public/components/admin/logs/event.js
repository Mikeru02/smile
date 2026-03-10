import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable.js";
import CSVExporter from "../../../utils/csvExporter.js";
import socketClient from "../../../sockets/socketInstance.js";

export default async function PageEvents() {
    socketClient.connect();
    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1`,
        headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SRC_KEY,
            "token": localStorage.getItem("token")
        }
    });

    const table =  document.getElementById("logs-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    let headers = populateHeaders(thead, "logs");


    socketClient.off('LOGS');
    socketClient.on('LOGS', (data) => {
        const logs = data.logs;
        populateTable(tbody, logs, headers);
    })

    socketClient.emit('GET_LOGS');

    const exportBtn = document.getElementById('export-logs');
    exportBtn.addEventListener('click', async function() {
        try {
            const logs = await axiosClient.get(
                `logs/`
            )
            CSVExporter.download(logs.data.data, "logs.csv");
        }
        catch (err) {

        }
    })
}