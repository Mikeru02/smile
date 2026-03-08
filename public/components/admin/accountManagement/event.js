import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable.js";
import CSVExporter from "../../../utils/csvExporter.js";

export default async function PageEvents() {
    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SRC_KEY,
        }
    });

    const addAccountBtn = document.getElementById('add-account');
        addAccountBtn.addEventListener('click', function() {
    })

    const response = await axiosClient.get(
        `account/all`,
        {
            headers: {
                'token': localStorage.getItem('token')
            }
        }
    );

    const modal = document.getElementById('modal');
    
    const accounts = response.data.data;
    console.log(accounts);
    const table =  document.getElementById("accounts-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    let headers = populateHeaders(thead, "account-management");
    populateTable(tbody, accounts, headers);

    const seeMoreBtns = document.querySelectorAll('.see-more');
    seeMoreBtns.forEach(button => {
        button.addEventListener('click', async function() {
            const accountData = await axiosClient.get(
                `admin/account/${button.dataset.id}`,
                {
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                }
            );

            const account = accountData.data.data;
            modal.style.display = 'block';
        })
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

}