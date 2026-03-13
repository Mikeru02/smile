import axios from 'axios';
import { populateHeaders, populateTable } from '../../../utils/populateTable.js';
import CSVExporter from '../../../utils/csvExporter.js';
import socketClient from '../../../sockets/socketInstance.js';
import secondsToTime from '../../../utils/secondsToTime.js';
import timeToSeconds from '../../../utils/timeToSeconds.js';

export default async function Event() {
    socketClient.connect();
    const today = new Date().toISOString().split('T')[0];
    const table = document.getElementById("clients-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    const modal = document.getElementById('modal');
    const deleteBtn = document.getElementById('delete');
    const saveBtn = document.getElementById('save');
    const exitBtn = document.getElementById('exit');
    const headers = populateHeaders(thead, "all-client");

    const nameElement = document.getElementById('client-name');
    const courseElement = document.getElementById('client-course');
    const yearlvlElement = document.getElementById('client-yearlevel');
    const statusElement = document.getElementById('client-status');
    const timeEarnedElement = document.getElementById('client-timeEarned');
    const timeRemainingElement = document.getElementById('client-timeRemaining');
    const wasteCollectedElement = document.getElementById('client-wasteCollected');
    const createdAtElement = document.getElementById('client-createdAt');

    const activeTimers = new Map();

    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1/`,
        headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SRC_KEY,
            "token": localStorage.getItem("token")
        }
    });

    socketClient.off('CLIENTS');
    socketClient.on('CLIENTS', (data) => {
        const clients = data.clients;
        console.log("CLIENTS:", clients);

        // Clear existing timers (important in SPA)
        activeTimers.forEach(interval => clearInterval(interval));
        activeTimers.clear();

        tbody.innerHTML = '';
        if (clients.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = headers.length; // span across all columns
            cell.textContent = "No clients found";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }

        populateTable(tbody, clients, headers);

        const rows = tbody.querySelectorAll("tr");

        rows.forEach((row, index) => {
            const client = clients[index];
            if (!client) return;

            const timeCell = row.querySelector('.time');
            if (!timeCell) return;

            if (client.status === "active") {

                let seconds = client.time_remaining;

                const interval = setInterval(() => {

                    if (seconds <= 0) {
                        clearInterval(interval);
                        activeTimers.delete(client.id);
                        timeCell.textContent = "00:00:00";
                        return;
                    }

                    seconds--;
                    const { hrs, mins, secs } = secondsToTime(seconds);
                    timeCell.textContent = `${hrs}:${mins}:${secs}`

                }, 1000);

                activeTimers.set(client.id, interval);
            }
        });


    });

    socketClient.off('SPECIFIC_CLIENT');
    socketClient.on('SPECIFIC_CLIENT', (data) => {
        const client = data.clientData;
        console.log(client);

        if (nameElement) nameElement.value = client.username || '';
        if (statusElement) statusElement.value = client.status || 'active';
        if (timeEarnedElement) timeEarnedElement.value = client.time_earned || 0;
        if (timeRemainingElement) timeRemainingElement.value = client.time_remaining || 0;
        if (wasteCollectedElement) wasteCollectedElement.value = client.waste_collected || 0;
        if (createdAtElement) createdAtElement.value = client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A';

        saveBtn.dataset.clientId = client.id;
        deleteBtn.dataset.clientId = client.id;

        modal.style.display = 'block';
    })

    socketClient.emit('GET_CLIENTS');

    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal')
    const isLogedIn = document.getElementById('filter-logedin')
    const status = document.getElementById('filter-status');
    const dateFrom = document.getElementById('filter-date-from');
    const dateTo =document.getElementById('filter-date-to');
    const limit = document.getElementById('filter-limit');
    const applyFilter = document.getElementById('apply-filter');
    const cancelExportBtn = document.getElementById('cancel-filter');
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.style.display = "none"

    tbody.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('see-more')) {
            const button = e.target;
            socketClient.emit('GET_SPECIFIC_CLIENT', ({ clientId: button.dataset.id }));
        }
    })

    exitBtn.addEventListener('click', function() {
        modal.style.display = "none";
    })

    deleteBtn.addEventListener('click', function() {
        socketClient.emit('DELETE_CLIENT', ({ clientId: deleteBtn.dataset.clientId }));
        modal.style.display = "none"
    })

    saveBtn.addEventListener('click', function() {
        const payload = {
            clientId: saveBtn.dataset.clientId,
            clientData: {
                name: nameElement.value || null,
                course: courseElement.value || null,
                year_level: yearlvlElement.value || null,
                status: statusElement.value || null,
                time_earned: timeEarnedElement.value || null,
                time_remaining: timeRemainingElement.value || null,
            }
        };

        socketClient.emit("UPDATE_CLIENT", payload)

        modal.style.display = "none";
    })

    filterBtn.addEventListener('click',function() {
        filterModal.style.display = "block"
    })

    applyFilter.addEventListener('click', function() {
        socketClient.emit('FILTER_CLIENT', ({
            is_logged: isLogedIn.value || null,
            status: status.value || null,
            from: dateFrom.value || null,
            to: dateTo.value || null,
            limit: limit.value || null
        }));
        filterModal.style.display = "none";
        clearBtn.style.display = "block"

    })
    

    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', async function() {
        try {
            const response = await axiosClient.get('client/export', {
                headers: {
                    "token": localStorage.getItem('token')
                },
                params: {
                    is_logged: isLogedIn.value || null,
                    status: status.value || null,
                    from: dateFrom.value || null,
                    to: dateTo.value || null,
                    limit: limit.value || null
                }
            });

            console.log(response.data);

            const logs = response.data.clients || [];
            if (logs.length === 0) {
                alert("No clients found for the selected filters.");
                return;
            }

            CSVExporter.download(logs, "clients_export.csv");
            filterModal.style.display = "none";

        } catch (err) {
            console.error("Failed to export clients:", err);
            alert("Failed to export clients.");
        }
    });

    cancelExportBtn.addEventListener('click', function() {
        filterModal.style.display = "none";
    })

    clearBtn.addEventListener('click',function() {
        clearBtn.style.display = "none";
        socketClient.emit('GET_CLIENTS');
        isLogedIn.value = "";
        status.value = "";
        dateFrom.value = "";
        dateTo.value= "";
        limit = 30;
    })

}