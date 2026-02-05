import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles.analyticsContainer}">
            <div class="${styles.filter}">
                <select id="select-filter">
                    <option value="all-users">All Users</option>
                    <option value="bin-count">Full Bin Count</option>
                </select>
            </div>
            
            <div class="${styles.analyticsTableContainer}">
                <table id="analytics-table" class="${styles['analytics-table']}">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;
}