import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable.js";

export default async function PageEvents() {
    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SRC_KEY,
        }
    })
    const addAccountBtn = document.getElementById('add-account');
        addAccountBtn.addEventListener('click', function() {
    })


    const response = await axiosClient.get(
        `admin/accounts`,
        {
            headers: {
                'token': localStorage.getItem('token')
            }
        }
    );

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
            try {
            const accountData = await axiosClient.get(
                `admin/account/${button.dataset.id}`,
                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
        } catch (err) {
            console.error(err.message)
        }

            const account = accountData.data.data;
        })
    })
}