import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles['logs-container']}">
            <div class="${styles['logs-table-container']}">
                <table id="logs-table" class="${styles['logs-table']}">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Event</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;
}