import { SELECT_CONFIG } from "../config/selectConfig.js";

// Populate any select element
export function populateSelect(select, items, valueKey = "name") {
    select.innerHTML = ""; // clear existing options
    if (!items) return;

    for (const item of items) {
        const option = document.createElement("option");
        option.textContent = item[valueKey];
        option.value = item[valueKey];
        select.appendChild(option);
    }
}