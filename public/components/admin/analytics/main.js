import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <select id="select-filter" class="${styles["filter"]}">
            <option value="all-users">All Users</option>
            <option value="bin-count">Full Bin Count</option>
        </select>

        <table id="analytics-table" class="analytics-table">
            <thead></thead>
            <tbody></tbody>
        </table>
    `;
}