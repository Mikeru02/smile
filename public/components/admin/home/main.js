import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles["card"]}">
            <p class="${styles["stats"]}"><span>0</span>Total Users</p>
            <p class="${styles["stats"]}"><span>0</span>Past Users</p>
        </div>
        <div class="${styles["card"]}">
            <p class="${styles["stats"]}"><span>0</span>Current Users</p>
        </div>
        <div class="${styles["card"]}">
            <p class="${styles["stats"]}"><span>0</span>Full Bin Count</p>
        </div>
    `;

    root.className = styles["main"];
}