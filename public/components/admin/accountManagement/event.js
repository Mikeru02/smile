import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable";

export default async function PageEvents() {
    const response = await axios.get(
        `/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/account/all`,
        {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SRC_KEY,
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
}