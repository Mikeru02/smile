import { TABLE_CONFIG } from "../config/tableConfig.js";
import { formatSeconds } from "./formatTime.js";

export function populateTable(tbody, data, headers) {
    tbody.innerHTML = "";

    if (!Array.isArray(data)) return;

    data.forEach(row => {
        const trow = document.createElement("tr");    
        headers.forEach(head => {
            const tdata = document.createElement('td');
            let value = row[head.key] ?? "";

            if (head.key === 'time_remaining') {
                value = formatSeconds(value);
                tdata.id = "time";
            } else if (head.key === 'details') {
                value = 'See more';
                tdata.id = "see-more"
            }

            tdata.textContent = value;
            trow.appendChild(tdata);
        });
        tbody.appendChild(trow);
    });
}

export function populateHeaders(thead, select) {
    thead.innerHTML = "";

    let config = null;

    if (typeof select === 'string'){
        config = TABLE_CONFIG[select];
    } else {
        config = TABLE_CONFIG[select.value]
    }

    if (!config) return [];

    const trow = document.createElement('tr');
    config.forEach(head => {
        const thead = document.createElement('th');
        thead.textContent = head.label;
        trow.appendChild(thead);
    });
    thead.appendChild(trow);
    return config;
}