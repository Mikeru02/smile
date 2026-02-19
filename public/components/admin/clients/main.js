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
                <table class="${styles["clients-table"]}" id="clients-table">
                    <thead></thead>
                    <tbody></tbody>
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

            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <p>Some text in the Modal..</p>
                </div>
            </div>
        </div>
    `;

    root.className = styles["main"];
}

