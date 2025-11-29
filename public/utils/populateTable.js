export function populateTable(tbody, data, headers) {
    tbody.innerHTML = "";

    if (!data || data.length === 0) return;

    data.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(col => {
            const td = document.createElement("td");
            td.textContent = row[col] ?? "";
            tr.appendChild(td);
        })
        tbody.appendChild(tr);
    });
}

export function populateHeaders(thead, select) {
    thead.innerHTML = "";

    let headers = [];

    switch (select.value) {
        case "all-users":
            headers = ["UserID", "Name", "Course", "Year Level", "Time", "Action"];
            break;
        case "bin-count":
            headers = ["Num of Full Bin", "Date", "Time"]
            break;
        default:
            headers = [];
    }

    if (headers.length === 0) return;

    const headerRow = document.createElement("tr");
    headers.forEach(head => {
        const th = document.createElement("th");
        th.textContent = head;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    return headers;
}