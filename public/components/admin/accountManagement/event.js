import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable.js";
import CSVExporter from "../../../utils/csvExporter.js";
import socketClient from "../../../sockets/socketInstance.js";

export default async function PageEvents() {
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

    // View & Change Modal
    const usernameElement = document.getElementById('admin-username');
    const nameElement = document.getElementById('admin-name');
    const roleElement = document.getElementById('admin-role');
    const createdElement = document.getElementById('admin-created_at');
    const passwordElement = document.getElementById('admin-password');
    // const response = await axiosClient.get(
    //     `account/all`,
    //     {
    //         headers: {
    //             'token': localStorage.getItem('token')
    //         }
    //     }
    // );

    socketClient.emit("GET_ACCOUNTS");
    
    socketClient.off("ACCOUNTS");
    socketClient.on("ACCOUNTS", (data) => {
        console.log("ACCOUNTS:", data);
        accounts = data.accounts;

        console.log(accounts);

        let headers = populateHeaders(thead, "account-management");
        populateTable(tbody, accounts, headers);
    })

    const modal = document.getElementById('modal');
    const createModal = document.getElementById('create-modal')
    
    tbody.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('see-more')) {
            const button = e.target;
            const accountData = await axiosClient.get(
                `account/?field=id&value=${button.dataset.id}`,
                {
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                }
            );

            const account = accountData.data.data;

            if (usernameElement) usernameElement.value = account.username;
            if (nameElement) nameElement.value = account.name;
            if (roleElement) roleElement.value = account.role;
            if (createdElement) createdElement.value = account.created_at ? new Date(account.created_at).toLocaleDateString() : 'N/A';;

            saveViewModal.dataset.clientId = button.dataset.id;
            deleteViewModal.dataset.clientId = button.dataset.id;

            modal.style.display = 'block';
        }
    })

    const exportBtn = document.getElementById('export-btn');
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
        document.getElementById('create-username').value = "";
        document.getElementById('create-name').value = "";
        document.getElementById('create-password').value = "";
    });

    saveCreateBtn.addEventListener('click', async function() {
        try {
            const response = await axiosClient.post(
                `account/`,
                {
                    username: document.getElementById('create-username').value,
                    name: document.getElementById('create-name').value,
                    role: document.getElementById('create-role').value,
                    password: document.getElementById('create-password').value,
                },
                {
                    headers: {
                        "token": localStorage.getItem('token')
                    }
                }
            )
            createModal.style.display = "none";
            document.getElementById('create-username').value = "";
            document.getElementById('create-name').value = "";
            document.getElementById('create-password').value = "";
        }
        catch (err) {
            console.error('[ERROR]', response.data);
        }
    })

    const exitViewModal = document.getElementById('exit');
    const saveViewModal = document.getElementById('save');
    const deleteViewModal = document.getElementById('delete');

    exitViewModal.addEventListener('click', function() {
        modal.style.display = "none";
    });

    saveViewModal.addEventListener('click', async function() {
        const clientId = saveViewModal.dataset.clientId;
        if (!clientId) return;

        try {
            const response = await axiosClient.patch(
                `account/?field=id&value=${clientId}`,
                {
                    username: usernameElement.value,
                    name: nameElement.value,
                    role: roleElement.value,
                    password: passwordElement.value, 
                },
                {
                    headers: {
                        "token": localStorage.getItem('token')
                    }
                }
            )

            alert("Successfully Updated!")
            modal.style.display = "none";
        }
        catch (err) {
            console.error('ERROR', err.message);
        }
    })

    deleteViewModal.addEventListener('click', async function() {
        const clientId = deleteViewModal.dataset.clientId;
        if (!clientId) return;
        try {
            const response= await axiosClient.delete(
                `account/?field=id&value=${clientId}`,
                {
                    headers: {
                        "token": localStorage.getItem("token")
                    }
                }
            )
            console.log(response.data)
        }
        catch (err) {
            console.error('Error saving account:', err.response?.data || err.message);
        }
        finally {
            modal.style.display = 'none';
            window.app.pushRoute('/admin/account-management');
        }
    })
}