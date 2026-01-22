import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable.js";

export default async function PageEvents() {
    const response = await axios.get(
        `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/all-clients`,
        {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SRC_KEY,
                'token': localStorage.getItem('token') 
            }
        }
    );

    const clients = response.data.data;
    const selectValue = document.getElementById("select-filter");
    const table =  document.getElementById("analytics-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");


    let headers = populateHeaders(thead, selectValue);
    populateTable(tbody, clients, headers);
    
    selectValue.addEventListener("change", () => {
        headers = populateHeaders(thead, selectValue);
        populateTable(tbody, sampleData[selectValue.value], headers);
    });
}