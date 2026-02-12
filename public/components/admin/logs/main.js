import styles from "./component.module.css";

export default function MainContent(root) {
    // Sample log data - in real app, this would come from server
    const logs = [
        {
            id: 1,
            timestamp: "2024-02-10 14:30:09",
            event: "User Login",
            description: "Juan Dela Cruz connected from IP 192.168.1.101",
            level: "info"
        },
        {
            id: 2,
            timestamp: "2024-02-10 14:35:15",
            event: "Data Usage Alert",
            description: "Maria Santos exceeded data limit (2.5GB used)",
            level: "warning"
        },
        {
            id: 3,
            timestamp: "2024-02-10 14:40:22",
            event: "Session Timeout",
            description: "Jose Reyes session expired due to inactivity",
            level: "error"
        },
        {
            id: 4,
            timestamp: "2024-02-10 14:45:30",
            event: "System Start",
            description: "Wi-Fi hotspot service started successfully",
            level: "success"
        },
        {
            id: 5,
            timestamp: "2024-02-10 14:50:00",
            event: "Client Disconnected",
            description: "Ana Garcia disconnected from hotspot",
            level: "warning"
        }
    ];

    root.innerHTML = `
        <div class="${styles["logs-container"]}">
            <div class="${styles["logs-header"]}">
                <div class="${styles["logs-actions"]}">
                    <button class="${styles["btn-secondary"]}" id="export-logs">
                        <span>📥</span> Export Logs
                    </button>
                </div>
            </div>
            
            <div class="${styles["logs-wrapper"]}">
                <table class="${styles["logs-table"]}">
                    <thead>
                        <tr>
                            <th class="${styles["sortable"]}" data-sort="timestamp">Timestamp</th>
                            <th class="${styles["sortable"]}" data-sort="event">Event</th>
                            <th class="${styles["sortable"]}" data-sort="description">Description</th>
                            <th class="${styles["sortable"]}" data-sort="level">Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.map(log => `
                            <tr class="${styles["log-row"]} ${styles[log.level]}">
                                <td class="${styles["log-timestamp"]}">${log.timestamp}</td>
                                <td class="${styles["log-event"]}">${log.event}</td>
                                <td class="${styles["log-description"]}">${log.description}</td>
                                <td class="${styles["log-level"]}">
                                    <span class="${styles["level-badge"]} ${styles[log.level]}">${log.level.toUpperCase()}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="${styles["logs-footer"]}">
                <div class="${styles["pagination-info"]}">
                    Showing ${logs.length} log entries
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
    
    // Initialize logs functionality
    initializeLogsFunctionality();
}

function initializeLogsFunctionality() {
    // Sorting functionality
    const sortableHeaders = document.querySelectorAll(`.${styles["sortable"]}`);
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.dataset.sort;
            sortLogs(sortField);
        });
    });
    
    const logsHeader = document.querySelector(`.${styles["logs-header"]}`);
    //logsHeader.insertBefore(filterInput, logsHeader.firstChild);
    
    // filterInput.addEventListener('input', (e) => {
    //     filterLogs(e.target.value);
    // });
}

function sortLogs(field) {
    console.log(`Sorting logs by ${field}`);
    // In real implementation, this would sort the log data
}

function filterLogs(searchTerm) {
    console.log(`Filtering logs by: ${searchTerm}`);
    // In real implementation, this would filter the log rows
}

// Global functions for button actions
window.exportLogs = function() {
    console.log('Exporting logs...');
    // In real implementation, this would export logs to file
    alert('Logs exported successfully');
};

window.clearLogs = function() {
    console.log('Clearing logs...');
    // In real implementation, this would clear logs from database
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
        alert('Logs cleared successfully');
    }
};