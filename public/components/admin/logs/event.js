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
    const filterModal = document.getElementById('filter-modal')


    socketClient.off('LOGS');
    socketClient.on('LOGS', (data) => {
        const logs = data.logs;
        console.log(logs);

        tbody.innerHTML = '';
        if (logs.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = headers.length; // span across all columns
            cell.textContent = "No logs found";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }

        populateTable(tbody, logs, headers);
    })
    
    socketClient.emit('GET_LOGS');

    const filterBtn = document.getElementById('filter-btn');
    const logLevel = document.getElementById('filter-level');
    const dateFrom = document.getElementById('filter-date-from');
    const dateTo =document.getElementById('filter-date-to');
    const limit = document.getElementById('filter-limit');
    const applyFilter = document.getElementById('apply-filter');
    const cancelExportBtn = document.getElementById('cancel-filter');
    const exportBtn = document.getElementById('export-btn');
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.style.display = "none"

    filterBtn.addEventListener('click',function() {
        filterModal.style.display = "block"
    })

    applyFilter.addEventListener('click', function() {
        socketClient.emit('FILTER_CLIENT', ({
            level: logLevel.value || null,
            from: dateFrom.value || null,
            to: dateTo.value || null,
            limit: limit.value || null
        }));
        filterModal.style.display = "none";
        clearBtn.style.display = "block"

    })

    exportBtn.addEventListener('click', async function() {
        try {
            const response = await axiosClient.get('logs/export', {
                headers: {
                    "token": localStorage.getItem('token')
                },
                params: {
                    level: logLevel.value || null,
                    from: dateFrom.value || null,
                    to: dateTo.value || null,
                    limit: limit.value || null
                }
            });

            console.log(response.data);

            const logs = response.data.logs || [];
            if (logs.length === 0) {
                alert("No logs found for the selected filters.");
                return;
            }

            CSVExporter.download(logs, "logs_export.csv");
            filterModal.style.display = "none";

        } catch (err) {
            console.error("Failed to export logs:", err);
            alert("Failed to export logs.");
        }
    });

    cancelExportBtn.addEventListener('click', function() {
        filterModal.style.display = "none";
    })

    clearBtn.addEventListener('click',function() {
        clearBtn.style.display = "none";
        socketClient.emit('GET_LOGS')
    })
}