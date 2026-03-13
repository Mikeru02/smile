import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable.js";
import CSVExporter from "../../../utils/csvExporter.js";
import socketClient from "../../../sockets/socketInstance.js";

export default async function PageEvents() {
    socketClient.connect();
    socketClient.on('connect', () => {
        
    })
    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SRC_KEY,
        }
    });

    let accounts;
    const table =  document.getElementById("accounts-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    let headers = populateHeaders(thead, "account-management");

    // View & Change Modal
    const usernameElement = document.getElementById('admin-username');
    const nameElement = document.getElementById('admin-name');
    const roleElement = document.getElementById('admin-role');
    const createdElement = document.getElementById('admin-created_at');
    const passwordElement = document.getElementById('admin-password');

    // Create Modal
    const username = document.getElementById('create-username');
    const name = document.getElementById('create-name');
    const role = document.getElementById('create-role');
    const password = document.getElementById('create-password');

    socketClient.off("ACCOUNTS");
    socketClient.on("ACCOUNTS", (data) => {
        console.log("ACCOUNTS:", data);
        accounts = data.accounts;

        console.log(accounts);

        tbody.innerHTML = '';
        if (logs.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = headers.length; // span across all columns
            cell.textContent = "No logs found";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        populateTable(tbody, accounts, headers);
    })

    socketClient.off('SPECIFIC_ACCOUNT');
    socketClient.on('SPECIFIC_ACCOUNT', (data) => {
        const account = data.accountData;

        if (usernameElement) usernameElement.value = account.username;
        if (nameElement) nameElement.value = account.name;
        if (roleElement) roleElement.value = account.role;
        if (createdElement) createdElement.value = account.created_at ? new Date(account.created_at).toLocaleDateString() : 'N/A';;

        saveViewModal.dataset.clientId = account.id;
        deleteViewModal.dataset.clientId = account.id;

        modal.style.display = 'block';
    })

    socketClient.emit("GET_ACCOUNTS");


    const modal = document.getElementById('modal');
    const createModal = document.getElementById('create-modal')
    
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal');
    const roleFilter = document.getElementById('filter-role');
    const dateFrom = document.getElementById('filter-date-from');
    const dateTo = document.getElementById('filter-date-to');
    const limitFilter = document.getElementById('filter-limit');
    const cancelFilter = document.getElementById('cancel-filter');
    const applyFilter = document.getElementById('apply-filter');
    const exportBtn = document.getElementById('export-btn');
    const clearFilter = document.getElementById('clear-btn');
    clearFilter.style.display = "none";

    tbody.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('see-more')) {
            const button = e.target;
            socketClient.emit('GET_SPECIFIC_ACCOUNT', ({ accountId: button.dataset.id }));
        }
    })

    filterBtn.addEventListener('click', function() {
        filterModal.style.display = "block";
    })

    exportBtn.addEventListener('click', async function() {
        try {
            const accounts = await axiosClient.get(
                `account/all`
            )
            CSVExporter.download(accounts.data.data, "accounts.csv");
        }
        catch (err) {

        }
    })

    const addAccountBtn = document.getElementById('add-account');
    addAccountBtn.addEventListener('click', function() {
        createModal.style.display = "block";
    })

    const exitCreateBtn = document.getElementById('exit-createModal');
    const saveCreateBtn = document.getElementById('save-createModal');

    exitCreateBtn.addEventListener('click', function() {
        createModal.style.display = "none";
        username.value = "";
        name.value = "";
        password.value = "";
    });

    saveCreateBtn.addEventListener('click', function() {
        const userVal = username.value.trim();
        const nameVal = name.value.trim();
        const roleVal = role.value.trim();
        const passVal = password.value.trim();

        if (!userVal || !nameVal || !roleVal || !passVal) {
            alert("All fields are required!");
            return;
        }

        socketClient.emit('CREATE_ACCOUNT', ({
            username: userVal,
            name: nameVal,
            role: roleVal,
            password: passVal,
        }));

        createModal.style.display = "none";
        username.value = "";
        name.value = "";
        password.value = "";
    })

    const exitViewModal = document.getElementById('exit');
    const saveViewModal = document.getElementById('save');
    const deleteViewModal = document.getElementById('delete');

    exitViewModal.addEventListener('click', function() {
        modal.style.display = "none";
    });

    applyFilter.addEventListener('click', function() {
        socketClient.emit("FILTER_ACCOUNT", ({
            role: roleFilter.value || null,
            from: dateFrom.value || null,
            to: dateTo.value || null,
            limit: limitFilter.value || null
        }));
        filterModal.style.display = "none";
        clearFilter.style.display ="block";
    })

    saveViewModal.addEventListener('click', function() {
        const clientId = saveViewModal.dataset.clientId;
        if (!clientId) return;

        socketClient.emit('UPDATE_ACCOUNT', ({ 
            accountId: clientId, 
            accountData: {
                username: usernameElement.value,
                name: nameElement.value,
                role: roleElement.value,
                password: passwordElement.value, 
            }})
        )

        alert("Successfully Updated!")
        modal.style.display = "none";
    })

    deleteViewModal.addEventListener('click', async function() {
        const clientId = deleteViewModal.dataset.clientId;
        if (!clientId) return;

        socketClient.emit('DELETE_ACCOUNT', ({ accountId: clientId }));
        modal.style.display = "none";
    })

    cancelFilter.addEventListener('click', function() {
        filterModal.style.display = "none"
    })

    clearFilter.addEventListener('click', function() {
        clearFilter.style.display = "none";
        socketClient.emit("GET_ACCOUNTS");
        role.value = "";
        logLevel.value = "";
        dateFrom.value = "";
        dateTo.value= "";
        limit = 30;
    })
}