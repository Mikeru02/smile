import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <table id="analytics-table" class="analytics-table">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Event</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
}