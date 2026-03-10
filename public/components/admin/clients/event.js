import axios from 'axios';
import { populateHeaders, populateTable } from '../../../utils/populateTable.js';
import CSVExporter from '../../../utils/csvExporter.js';
import socketClient from '../../../sockets/socketInstance.js';

export default async function Event() {
    socketClient.connect();
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

    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1`,
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

        tbody.innerHTML = '';
        populateTable(tbody, clients, headers);

    });

    socketClient.off('SPECIFIC_CLIENT');
    socketClient.on('SPECIFIC_CLIENT', (data) => {
        const client = data.clientData;
        console.log(client);

        if (nameElement) nameElement.value = client.name || '';
        if (courseElement) courseElement.value = client.course || '';
        if (yearlvlElement) yearlvlElement.value = client.year_level || '';
        if (statusElement) statusElement.value = client.status || 'active';
        if (timeEarnedElement) timeEarnedElement.value = client.time_earned || 0;
        if (timeRemainingElement) timeRemainingElement.value = client.time_remaining || 0;
        if (wasteCollectedElement) wasteCollectedElement.value = client.waste_collected || 0;
        if (createdAtElement) createdAtElement.value = client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A';

        saveBtn.dataset.clientId = button.dataset.id;
        deleteBtn.dataset.clientId = button.dataset.id;

        modal.style.display = 'block';
    })

    socketClient.emit('GET_CLIENTS');

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
    })

    saveBtn.addEventListener('click', function() {
        socketClient.emit('UPDATE_CLIENT', ({ 
            clientId: saveBtn.dataset.id,
            clientData: {
                name: nameElement.value,
                course: courseElement.value,
                year_level: yearlvlElement.value,
                status: statusElement.value,
                time_earned: timeEarnedElement.value,
                time_remaining: timeRemainingElement.value,
            }
        }))
    })

    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', async function() {
        try {
            const clients = await axiosClient.get(
                `client/all`
            )
            CSVExporter.download(clients.data.data, "clients.csv");
        }
        catch (err) {

        }
    })
}