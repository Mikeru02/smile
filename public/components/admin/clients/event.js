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
            console.log("CLIENT: ", client.waste_collected);
            document.getElementById('client-name').textContent = client.name || 'N/A';
            document.getElementById('client-ip').textContent = client.ip || 'N/A';
            
            // Set status dropdown to current client status
            const statusSelect = document.getElementById('client-status');
            statusSelect.value = client.status || 'active';
            
            document.getElementById('client-timeEarned').value = client.time_earned || 0;
            document.getElementById('client-timeRemaining').value = client.time_remaining || 0;
            document.getElementById('client-wasteCollected').textContent = client.waste_collected || 0;
            document.getElementById('client-createdAt').textContent = client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A';

            document.getElementById('modal').style.display = 'block';
            
            // Add event listeners for modal buttons
            document.getElementById('exit').addEventListener('click', () => {
                document.getElementById('modal').style.display = 'none';
            });
            
            document.getElementById('proceed').addEventListener('click', async () => {
                // Get updated values from editable fields
                const updatedData = {
                    status: document.getElementById('client-status').value,
                    time_earned: parseInt(document.getElementById('client-timeEarned').value) || 0,
                    time_remaining: parseInt(document.getElementById('client-timeRemaining').value) || 0
                };
                
                try {
                    // Send update request to API
                    await axios.put(
                        `/api/v1/client/client/${button.dataset.id}`,
                        updatedData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "apikey": import.meta.env.VITE_SRC_KEY,
                                "token": localStorage.getItem('token')
                            }
                        }
                    );
                    console.log('Client updated successfully:', updatedData);
                    
                    // Refresh the table to show updated data
                    await Event();
                    
                    // Close modal
                    document.getElementById('modal').style.display = 'none';
                } catch (error) {
                    console.error('Error updating client:', error);
                    alert('Failed to update client. Please try again.');
                }
            });
        });
    });
}
