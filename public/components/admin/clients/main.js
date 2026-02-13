import styles from "./component.module.css";

export default function MainContent(root) {
    // Sample client data - in real app, this would come from server
    const clients = [
        {
            id: 1,
            ipAddress: "192.168.1.101",
            name: "Juan Dela Cruz",
            email: "juan.delacruz@example.com",
            course: "BSCS",
            yearLevel: "3rd Year",
            status: "active",
            registrationDate: "2024-01-15",
            timeRemaining: "04:30:09",
            dataUsage: "2.5 GB",
            wasteCollected: "15 items"
        },
        {
            id: 2,
            ipAddress: "192.168.1.102",
            name: "Maria Santos",
            email: "maria.santos@example.com",
            course: "BEED",
            yearLevel: "2nd Year",
            status: "active",
            registrationDate: "2024-01-20",
            timeRemaining: "04:30:09",
            dataUsage: "1.8 GB",
            wasteCollected: "8 items"
        },
        {
            id: 3,
            ipAddress: "192.168.1.103",
            name: "Jose Reyes",
            email: "jose.reyes@example.com",
            course: "STEM",
            yearLevel: "11th Grade",
            status: "pending",
            registrationDate: "2024-01-10",
            timeRemaining: "00:00:00",
            dataUsage: "3.2 GB",
            wasteCollected: "22 items"
        },
        {
            id: 4,
            ipAddress: "192.168.1.104",
            name: "Ana Garcia",
            email: "ana.garcia@example.com",
            course: "BSBA",
            yearLevel: "4th Year",
            status: "dropping",
            registrationDate: "2024-01-25",
            timeRemaining: "01:45:12",
            dataUsage: "4.1 GB",
            wasteCollected: "31 items"
        },
        {
            id: 5,
            ipAddress: "192.168.1.105",
            name: "Carlos Mendoza",
            email: "carlos.mendoza@example.com",
            course: "HUMSS",
            yearLevel: "1st Year",
            status: "inactive",
            registrationDate: "2024-02-01",
            timeRemaining: "03:20:45",
            dataUsage: "0.9 GB",
            wasteCollected: "5 items"
        }
    ];

    root.innerHTML = `
        <div class="${styles["clients-container"]}">
            <div class="${styles["table-header"]}">
                <div class="${styles["table-actions"]}">
                    <button class="${styles["btn-secondary"]}" id="export-btn">
                        <span>📥</span> Export Data
                    </button>
                </div>
            </div>
            
            <div class="${styles["table-wrapper"]}">
                <table class="${styles["clients-table"]}">
                    <thead>
                        <tr>
                            <th class="${styles["sortable"]}" data-sort="id">ID</th>
                            <th class="${styles["sortable"]}" data-sort="ipAddress">IP Address</th>
                            <th class="${styles["sortable"]}" data-sort="name">Client Name</th>
                            <th class="${styles["sortable"]}" data-sort="course">Course</th>
                            <th class="${styles["sortable"]}" data-sort="yearLevel">Year Level</th>
                            <th class="${styles["sortable"]}" data-sort="status">Status</th>
                            <th class="${styles["sortable"]}" data-sort="registrationDate">Registration Date</th>
                            <th class="${styles["sortable"]}" data-sort="timeRemaining">Time Remaining</th>
                            <th class="${styles["sortable"]}" data-sort="wasteCollected">Waste Collected</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(client => `
                            <tr class="${styles["table-row"]}" data-client-id="${client.id}">
                                <td class="${styles["client-id"]}">${client.id}</td>
                                <td class="${styles["client-ip"]}">${client.ipAddress}</td>
                                <td class="${styles["client-name"]}">
                                    <div class="${styles["client-info"]}">
                                        <span class="${styles["name"]}">${client.name}</span>
                                    </div>
                                </td>
                                <td class="${styles["client-course"]}">${client.course}</td>
                                <td class="${styles["client-year"]}">${client.yearLevel}</td>
                                <td class="${styles["client-status"]}">
                                    <span class="${styles["status-badge"]} ${styles[client.status]}">
                                        ${client.status === 'active' ? 'Active' : 
                                         client.status === 'pending' ? 'Pending' : 
                                         client.status === 'dropping' ? 'Dropping' : 'Inactive'}
                                    </span>
                                </td>
                                <td class="${styles["client-date"]}">${client.registrationDate}</td>
                                <td class="${styles["client-time"]}">${client.timeRemaining}</td>
                                <td class="${styles["client-waste"]}">${client.wasteCollected}</td>
                                <td class="${styles["client-actions"]}">
                                    <button class="${styles["btn-action"]} ${styles["btn-view"]}" 
                                            onclick="viewClientDetails(${client.id})" 
                                            title="View Full Details">
                                        👁️ View
                                    </button>
                                    <button class="${styles["btn-action"]} ${styles["btn-edit"]}" 
                                            onclick="editClient(${client.id})" 
                                            title="Edit Client">
                                        ✏️ Edit
                                    </button>
                                    <button class="${styles["btn-action"]} ${styles["btn-delete"]}" 
                                            onclick="deleteClient(${client.id})" 
                                            title="Delete Client">
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="${styles["table-footer"]}">
                <div class="${styles["pagination-info"]}">
                    Showing ${clients.length} of ${clients.length} clients
                </div>
                <div class="${styles["pagination-controls"]}">
                    <button class="${styles["btn-pagination"]}" id="prev-page">Previous</button>
                    <span class="${styles["page-info"]}>Page 1 of 1</span>
                    <button class="${styles["btn-pagination"]}" id="next-page">Next</button>
                </div>
            </div>
        </div>
    `;

    root.className = styles["main"];
    
    // Initialize table functionality
    initializeTableFunctionality();
}

function initializeTableFunctionality() {
    // Sorting functionality
    const sortableHeaders = document.querySelectorAll(`.${styles["sortable"]}`);
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.dataset.sort;
            sortTable(sortField);
        });
    });
    
    // Search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search clients...';
    searchInput.className = styles['search-input'];
    
    const tableHeader = document.querySelector(`.${styles["table-header"]}`);
    tableHeader.insertBefore(searchInput, tableHeader.firstChild);
    
    searchInput.addEventListener('input', (e) => {
        filterTable(e.target.value);
    });
}

function sortTable(field) {
    console.log(`Sorting by ${field}`);
    // In real implementation, this would sort the table data
}

function filterTable(searchTerm) {
    console.log(`Filtering by: ${searchTerm}`);
    // In real implementation, this would filter the table rows
}

// Global functions for button actions
window.viewClientDetails = function(clientId) {
    console.log(`Viewing details for client ${clientId}`);
    // In real implementation, this would open a modal or navigate to details page
    alert(`View full details for client ID: ${clientId}`);
};

window.editClient = function(clientId) {
    console.log(`Editing client ${clientId}`);
    // In real implementation, this would open an edit modal
    alert(`Edit client ID: ${clientId}`);
};

window.deleteClient = function(clientId) {
    console.log(`Deleting client ${clientId}`);
    // In real implementation, this would show a confirmation dialog
    if (confirm(`Are you sure you want to delete client ID: ${clientId}?`)) {
        alert(`Client ${clientId} deleted`);
    }
};