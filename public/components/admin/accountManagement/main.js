import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <table id="analytics-table" class="analytics-table">
            <thead>
                <tr>
                    <th>UserID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
}