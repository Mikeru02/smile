import styles from "./component.module.css";

export default function MainContent(root) {
    // Sample account data - in real app, this would come from server
    const accounts = [
        {
            id: 1,
            username: "admin",
            email: "admin@smile.com",
            role: "Administrator",
            status: "active",
            lastLogin: "2024-02-10 14:30:09",
            createdDate: "2024-01-01",
            permissions: ["Full Access", "User Management", "System Settings"]
        },
        {
            id: 2,
            username: "operator1",
            email: "operator1@smile.com",
            role: "Operator",
            status: "active",
            lastLogin: "2024-02-10 13:15:22",
            createdDate: "2024-01-15",
            permissions: ["Client Management", "View Logs"]
        },
        {
            id: 3,
            username: "cashier1",
            email: "cashier1@smile.com",
            role: "Cashier",
            status: "inactive",
            lastLogin: "2024-02-08 09:45:33",
            createdDate: "2024-01-20",
            permissions: ["Client Management", "View Reports"]
        },
        {
            id: 4,
            username: "supervisor1",
            email: "supervisor1@smile.com",
            role: "Supervisor",
            status: "active",
            lastLogin: "2024-02-10 12:20:15",
            createdDate: "2024-02-01",
            permissions: ["Full Access", "User Management", "System Settings", "Reports"]
        },
        {
            id: 5,
            username: "operator2",
            email: "operator2@smile.com",
            role: "Operator",
            status: "suspended",
            lastLogin: "2024-02-05 16:30:45",
            createdDate: "2024-01-25",
            permissions: ["Client Management", "View Logs"]
        }
    ];

    root.innerHTML = `
        <div class="${styles["accounts-container"]}">
            <div class="${styles["accounts-header"]}">
                <div class="${styles["accounts-actions"]}">
                    <button class="${styles["btn-primary"]}" id="add-account">
                        <span>➕</span> Add Account
                    </button>
                    <button class="${styles["btn-secondary"]}" id="export-accounts">
                        <span>📥</span> Export Accounts
                    </button>
                </div>
            </div>
            
            <div class="${styles["accounts-wrapper"]}">
                <table class="${styles["accounts-table"]}">
                    <thead>
                        <tr>
                            <th class="${styles["sortable"]}" data-sort="id">ID</th>
                            <th class="${styles["sortable"]}" data-sort="username">Username</th>
                            <th class="${styles["sortable"]}" data-sort="email">Email</th>
                            <th class="${styles["sortable"]}" data-sort="role">Role</th>
                            <th class="${styles["sortable"]}" data-sort="status">Status</th>
                            <th class="${styles["sortable"]}" data-sort="lastLogin">Last Login</th>
                            <th class="${styles["sortable"]}" data-sort="createdDate">Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${accounts.map(account => `
                            <tr class="${styles["account-row"]}" data-account-id="${account.id}">
                                <td class="${styles["account-id"]}">${account.id}</td>
                                <td class="${styles["account-username"]}">
                                    <div class="${styles["account-info"]}">
                                        <span class="${styles["username"]}">${account.username}</span>
                                    </div>
                                </td>
                                <td class="${styles["account-email"]}">${account.email}</td>
                                <td class="${styles["account-role"]}">
                                    <span class="${styles["role-badge"]} ${styles[account.role.toLowerCase()]}">
                                        ${account.role}
                                    </span>
                                </td>
                                <td class="${styles["account-status"]}">
                                    <span class="${styles["status-badge"]} ${styles[account.status]}">
                                        ${account.status === 'active' ? 'Active' : 
                                         account.status === 'inactive' ? 'Inactive' : 'Suspended'}
                                    </span>
                                </td>
                                <td class="${styles["account-login"]}">${account.lastLogin}</td>
                                <td class="${styles["account-created"]}">${account.createdDate}</td>
                                <td class="${styles["account-actions"]}">
                                    <button class="${styles["btn-action"]} ${styles["btn-view"]}" 
                                            onclick="viewAccount(${account.id})" 
                                            title="View Account Details">
                                        👁️ View
                                    </button>
                                    <button class="${styles["btn-action"]} ${styles["btn-edit"]}" 
                                            onclick="editAccount(${account.id})" 
                                            title="Edit Account">
                                        ✏️ Edit
                                    </button>
                                    <button class="${styles["btn-action"]} ${styles["btn-delete"]}" 
                                            onclick="deleteAccount(${account.id})" 
                                            title="Delete Account">
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="${styles["accounts-footer"]}">
                <div class="${styles["pagination-info"]}">
                    Showing ${accounts.length} of ${accounts.length} accounts
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
    
    // Initialize accounts functionality
    initializeAccountsFunctionality();
}

function initializeAccountsFunctionality() {
    // Sorting functionality
    const sortableHeaders = document.querySelectorAll(`.${styles["sortable"]}`);
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.dataset.sort;
            sortAccounts(sortField);
        });
    });
    
    // Search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search accounts...';
    searchInput.className = styles['search-input'];
    
    const accountsHeader = document.querySelector(`.${styles["accounts-header"]}`);
    accountsHeader.insertBefore(searchInput, accountsHeader.firstChild);
    
    searchInput.addEventListener('input', (e) => {
        filterAccounts(e.target.value);
    });
    
    // Add account button
    const addBtn = document.getElementById('add-account');
    addBtn.addEventListener('click', addAccount);
    
    // Export accounts button
    const exportBtn = document.getElementById('export-accounts');
    exportBtn.addEventListener('click', exportAccounts);
}

function sortAccounts(field) {
    console.log(`Sorting accounts by ${field}`);
    // In real implementation, this would sort the table data
}

function filterAccounts(searchTerm) {
    console.log(`Filtering accounts by: ${searchTerm}`);
    // In real implementation, this would filter the table rows
}

function addAccount() {
    console.log('Adding new account...');
    // In real implementation, this would open an add account modal
    alert('Add Account functionality - would open account creation form');
}

function exportAccounts() {
    console.log('Exporting accounts...');
    // In real implementation, this would export accounts to file
    alert('Accounts exported successfully');
}

// Global functions for button actions
window.viewAccount = function(accountId) {
    console.log(`Viewing account ${accountId}`);
    // In real implementation, this would open a view modal
    alert(`View full details for account ID: ${accountId}`);
};

window.editAccount = function(accountId) {
    console.log(`Editing account ${accountId}`);
    // In real implementation, this would open an edit modal
    alert(`Edit account ID: ${accountId}`);
};

window.deleteAccount = function(accountId) {
    console.log(`Deleting account ${accountId}`);
    // In real implementation, this would show a confirmation dialog
    if (confirm(`Are you sure you want to delete account ID: ${accountId}? This action cannot be undone.`)) {
        alert(`Account ${accountId} deleted`);
    }
};