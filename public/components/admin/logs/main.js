import styles from "./component.module.css";

export default function MainContent(root) {
    // Sample log data - in real app, this would come from server
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
                <table class="${styles["logs-table"]}" id="logs-table">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            
            <div class="${styles["logs-footer"]}">
                <div class="${styles["pagination-info"]}">
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