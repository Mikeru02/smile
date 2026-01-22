import { SELECT_CONFIG } from "../config/selectConfig";

export function populateSelect(select) {
    select.innerHTML = "";
    const value = select.dataset.value;
    const courses = SELECT_CONFIG[value];

    for (const course of courses){
        console.log(course)
        let option = document.createElement("option");
        option.textContent = course.name;
        select.appendChild(option)
    }

}