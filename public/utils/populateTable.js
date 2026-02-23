import { TABLE_CONFIG } from "../config/tableConfig.js";
import { formatSeconds, formatDate, formatDateTime } from "./formatTime.js";
import styles from '../components/admin/clients/component.module.css';

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
                tdata.textContent = value;
            } 
            else if (head.key === 'details') {
                value = 'See more';
                tdata.classList.add('see-more');
                tdata.classList.add(styles.seeMore);
                tdata.dataset.id = row.id;
                tdata.textContent = value;
            } 
            else if (head.key === 'status') {
                const span = document.createElement('span');
                span.id = "status";
                span.className = styles.spanStatus;
                span.textContent = value;

                // Example status colors
                if (value === 'active') {
                    span.style.backgroundColor = 'green';
                } else if (value === 'expired') {
                    span.style.backgroundColor = 'red';
                } else if (value === 'pending') {
                    span.style.backgroundColor = 'orange';
                } else {
                    span.style.backgroundColor = 'gray';
                }
                tdata.appendChild(span);
            } 
            else if (head.key === 'created_at') {
                value = formatDate(value);
                tdata.textContent = value;
            }
            else if (head.key === 'timestamp' || head.key === 'last_login') {
                value = formatDateTime(value);
                tdata.textContent = value;
            }

            else if (head.key === 'waste_collected') {
                value = `${value} items`
                tdata.textContent = value;
            } 
            else {
                tdata.textContent = value;
            }
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