import axios from 'axios';
import { populateHeaders, populateTable } from '../../../utils/populateTable.js';

export default async function Event() {
    console.log('Event: Starting to fetch clients...');
    const allClients = await axios.get(
        '/api/v1/client/all-clients',
        {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_SRC_KEY
            }
        }
    );

    const clients = allClients.data.data;
    console.log('Event: Received clients data:', clients);
    const table = document.getElementById("clients-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    // Clear existing content
    tbody.innerHTML = '';

    let headers = populateHeaders(thead, "all-client");
    populateTable(tbody, clients, headers);

    const seeMore = document.querySelectorAll('.see-more');
    seeMore.forEach(button => {
        button.addEventListener('click', async () => {
            const clientData = await axios.get(
                `/api/v1/client/client/${button.dataset.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": import.meta.env.VITE_SRC_KEY,
                        "token": localStorage.getItem('token')
                    }
                }
            );
            console.log('Event: Received client data:', clientData.data);
            
            // Populate modal with client data
            const client = clientData.data.data;
            
            // Check if elements exist before setting values
            const nameElement = document.getElementById('client-name');
            const statusElement = document.getElementById('client-status');
            const timeEarnedElement = document.getElementById('client-timeEarned');
            const timeRemainingElement = document.getElementById('client-timeRemaining');
            const wasteCollectedElement = document.getElementById('client-wasteCollected');
            const createdAtElement = document.getElementById('client-createdAt');
            
            if (nameElement) nameElement.value = client.name || '';
            if (statusElement) statusElement.value = client.status || 'active';
            if (timeEarnedElement) timeEarnedElement.value = client.time_earned || 0;
            if (timeRemainingElement) timeRemainingElement.value = client.time_remaining || 0;
            if (wasteCollectedElement) wasteCollectedElement.value = client.waste_collected || 0;
            if (createdAtElement) createdAtElement.value = client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A';

            document.getElementById('modal').style.display = 'block';
            
            // Add event listeners for modal buttons
            document.getElementById('exit').addEventListener('click', () => {
                document.getElementById('modal').style.display = 'none';
            });
            
            document.getElementById('proceed').addEventListener('click', () => {
                document.getElementById('modal').style.display = 'none';
            });
        });
    });
}
