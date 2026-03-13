import styles from "./component.module.css";
import FilterModal from "./filtermodal";

export default function MainContent(root) {
    // Sample log data - in real app, this would come from server
    root.innerHTML = `
        <div class="${styles["logs-container"]}">
            <div class="${styles["logs-header"]}">
                <div class="${styles["logs-actions"]}">
                    <button class="${styles["btn-secondary"]}" id="clear-btn">Clear</button>
                    <button class="${styles["btn-secondary"]}" id="filter-btn">
                        <span>📥</span> Filter
                    </button>
                    <button class="${styles["btn-primary"]}" id="export-btn">
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
            <!--
            <div class="${styles["logs-footer"]}">
                <div class="${styles["pagination-info"]}">
                </div>
                <div class="${styles["pagination-controls"]}">
                    <button class="${styles["btn-pagination"]}" id="prev-page">Previous</button>
                    <span class="${styles["page-info"]}>Page 1 of 1</span>
                    <button class="${styles["btn-pagination"]}" id="next-page">Next</button>
                </div>
            </div>
            -->
            ${FilterModal()}
        </div>
    `;

    root.className = styles["main"];
    
    // Initialize logs functionality
    initializeLogsFunctionality();
}

function initializeLogsFunctionality() {
    // Export button event listener
    const exportButton = document.getElementById('export-logs');
    if (exportButton) {
        exportButton.addEventListener('click', showFilterModal);
    }
    
    // Sorting functionality
    const sortableHeaders = document.querySelectorAll(`.${styles["sortable"]}`);
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.dataset.sort;
            sortLogs(sortField);
        });
    });
    
    // Modal event listeners
    setupModalEventListeners();
}

function sortLogs(field) {
    console.log(`Sorting logs by ${field}`);
    // In real implementation, this would sort the log data
}

function filterLogs(searchTerm) {
    console.log(`Filtering logs by: ${searchTerm}`);
    // In real implementation, this would filter the log rows
}

function setupModalEventListeners() {
    const modal = document.getElementById('filter-modal');
    const cancelButton = document.getElementById('cancel-filter');
    const exportButton = document.getElementById('apply-filter-export');
    
    // Close modal on cancel
    if (cancelButton) {
        cancelButton.addEventListener('click', hideFilterModal);
    }
    
    // Export with filters
    if (exportButton) {
        exportButton.addEventListener('click', exportFilteredLogs);
    }
    
    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideFilterModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            hideFilterModal();
        }
    });
}

function showFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) {
        modal.style.display = 'block';
        // Clear previous filter values
        clearFilterFields();
    }
}

function hideFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function clearFilterFields() {
    document.getElementById('filter-name').value = '';
    document.getElementById('filter-description').value = '';
    document.getElementById('filter-level').value = '';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
}

function exportFilteredLogs() {
    const filters = {
        name: document.getElementById('filter-name').value,
        description: document.getElementById('filter-description').value,
        level: document.getElementById('filter-level').value,
        dateFrom: document.getElementById('filter-date-from').value,
        dateTo: document.getElementById('filter-date-to').value
    };
    
    // Check if any filters are set
    const hasFilters = Object.values(filters).some(value => value !== '');
    
    if (hasFilters) {
        console.log('Exporting logs with filters:', filters);
        // In real implementation, send filters to server
        // The server will apply filters and return filtered data for export
        // No need to filter the table since we're exporting directly
    } else {
        console.log('Exporting all logs (no filters applied)');
        // In real implementation, export all logs
    }
    
    // Hide modal after export
    hideFilterModal();
    
    // Show success message
    alert('Logs exported successfully!');
}

// Global functions for button actions
window.exportLogs = function() {
    showFilterModal();
};

window.clearLogs = function() {
    console.log('Clearing logs...');
    // In real implementation, this would clear logs from database
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
        alert('Logs cleared successfully');
    }
};