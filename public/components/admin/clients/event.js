import axios from 'axios';
import { populateHeaders, populateTable } from '../../../utils/populateTable.js';

export default async function Event() {
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`

    const axiosClient = axios.create({
        baseUrl: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1`,
        headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SRC_KEY,
            "token": localStorage.getItem("token")
        }
    })
    try {
        const allClients = await axiosClient.get(
            `client/all`
        );

        const clients = allClients.data.data;
        console.log("CLIENTS:", clients);
        const table = document.getElementById("clients-table");
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");

        tbody.innerHTML = '';

        const headers = populateHeaders(thead, "all-client");
        populateTable(tbody, clients, headers);

        const modal = document.getElementById('modal');
        const deleteBtn = document.getElementById('delete');
        const saveBtn = document.getElementById('save');
        const exitBtn = document.getElementById('exit');

        exitBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        deleteBtn.addEventListener('click', async () => {
            const clientId = deleteBtn.dataset.clientId;
            if (!clientId) return;

            try {
                await axios.delete(

                )
            }
            catch (err) {

            }
        })

        saveBtn.addEventListener('click', async () => {
            const clientId = saveBtn.dataset.clientId;
            if (!clientId) return;

            const clientStatus = document.getElementById('client-status').value;

            try {
                // Handle auth/deauth first
                if (clientStatus === 'active') {
                    await axiosClient.post(
                        `client/auth`,
                        { clientId },
                    );
                } else if (clientStatus === 'paused') {
                    const deauthResponse = await axiosClient.post(
                        `client/deauth`,
                        { clientId },
                    );
                }

                // Then update client info
                const patchResponse = await axiosClient.patch(
                    `client/?field=id&value=${clientId}`,
                    {
                        name: document.getElementById('client-name').value,
                        course: document.getElementById('client-course').value,
                        year_level: document.getElementById('client-yearlevel').value,
                        status: clientStatus,
                        time_remaining: Number(document.getElementById('client-timeRemaining').value),
                        time_earned: Number(document.getElementById('client-timeEarned').value)
                    }
                );

            } catch (err) {
                console.error('Error saving client:', err.response?.data || err.message);
            } finally {
                modal.style.display = 'none';
                window.app.pushRoute('/admin/clients');
            }
        });

        const seeMore = document.querySelectorAll('.see-more');
        seeMore.forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    const clientData = await axiosClient.get(
                        `client/?field=id&value=${button.dataset.id}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "apikey": import.meta.env.VITE_SRC_KEY,
                                "token": localStorage.getItem('token')
                            }
                        }
                    );

                    const client = clientData.data.data[0];
                    console.log(client);

                    const nameElement = document.getElementById('client-name');
                    const courseElement = document.getElementById('client-course');
                    const yearlvlElement = document.getElementById('client-yearlevel');
                    const statusElement = document.getElementById('client-status');
                    const timeEarnedElement = document.getElementById('client-timeEarned');
                    const timeRemainingElement = document.getElementById('client-timeRemaining');
                    const wasteCollectedElement = document.getElementById('client-wasteCollected');
                    const createdAtElement = document.getElementById('client-createdAt');

                    if (nameElement) nameElement.value = client.name || '';
                    if (courseElement) courseElement.value = client.course || '';
                    if (yearlvlElement) yearlvlElement.value = client.yearlevel || '';
                    if (statusElement) statusElement.value = client.status || 'active';
                    if (timeEarnedElement) timeEarnedElement.value = client.time_earned || 0;
                    if (timeRemainingElement) timeRemainingElement.value = client.time_remaining || 0;
                    if (wasteCollectedElement) wasteCollectedElement.value = client.waste_collected || 0;
                    if (createdAtElement) createdAtElement.value = client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A';

                    saveBtn.dataset.clientId = button.dataset.id;

                    modal.style.display = 'block';
                } catch (err) {
                    console.error('Error fetching client details:', err);
                }
            });
        });

    } catch (err) {
        console.error('Error fetching all clients:', err);
    }
}