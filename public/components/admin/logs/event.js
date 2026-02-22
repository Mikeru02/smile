import axios from "axios";
import { populateHeaders, populateTable } from "../../../utils/populateTable";

export default async function PageEvents() {
    const response = await axios.get(
        `/api/v1/logs/`,
        {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_SRC_KEY,
                "token": localStorage.getItem('token')
            }
        }
    )

    const logs = response.data.data;
    console.log(logs);
    const table =  document.getElementById("logs-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    let headers = populateHeaders(thead, "logs");
    populateTable(tbody, logs, headers);
}