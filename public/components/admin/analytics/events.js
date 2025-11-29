import { populateHeaders, populateTable } from "../../../utils/populateTable";

export default function PageEvents() {
    const selectValue = document.getElementById("select-filter");
    const table =  document.getElementById("analytics-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    const sampleData = {
        "all-users": [
            { "UserID": "221284", "Name": "Michael Ponce", "Course": "BSCS", "Year Level": "4", "Time": "1min"},
            { "UserID": "12356", "Name": "Allyana Marie Sarmiento", "Course": "BEED", "Year Level": "4", "Time": "1min"}
        ],
        "bin-count": [
            {"Num of Full Bin": "4", "Date": "11/29/2025", "Time": "11:00:00"},
            {"Num of Full Bin": "6", "Date": "11/20/2025", "Time": "17:00:00"}

        ]
    }

    let headers = populateHeaders(thead, selectValue);
    populateTable(tbody, sampleData[selectValue.value], headers);

    selectValue.addEventListener("change", () => {
        headers = populateHeaders(thead, selectValue);
        populateTable(tbody, sampleData[selectValue.value], headers);
    });
}