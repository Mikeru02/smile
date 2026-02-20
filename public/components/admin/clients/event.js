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
            document.getElementById('client-name').textContent = client.name || 'N/A';
            document.getElementById('client-email').textContent = client.email || 'N/A';
            document.getElementById('client-phone').textContent = client.phone || 'N/A';
            document.getElementById('client-address').textContent = client.address || 'N/A';
            document.getElementById('client-status').textContent = client.status || 'N/A';
            document.getElementById('client-created').textContent = client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A';
            
            document.getElementById('modal').style.display = 'block';
        });
    });
}
