import styles from "./component.module.css";
import Logo from "/icons/logo2.svg";
import HomeIcon from "/icons/dashboard.svg";
import AnalyticsIcon from "/icons/analytics.svg";
import LogsIcon from "/icons/logs.svg";
import AccountIcon from "/icons/accountManagement.svg";

export default function Header(root) {
    root.innerHTML = `
        <!-- Components ng Header -->
        <div class="${styles["logo-title"]}">
            <img src="${Logo}" class="${styles["logo"]}">
            <h1 class="${styles["title-logo"]}">SMILE</h1>
        </div>
        <div class="${styles["nav-buttons"]}">
            <div class="${styles["button"]}" data-value="/admin/dashboard">
                <img src="${HomeIcon}" class="${styles["button-logo"]}">
            </div>
            <div class="${styles["button"]}" data-value="/admin/analytics">
                <img src="${AnalyticsIcon}" class="${styles["button-logo"]}">
            </div>
            <div class="${styles["button"]}" data-value="/admin/logs">
                <img src="${LogsIcon}" class="${styles["button-logo"]}">
            </div>
            <div class="${styles["button"]}" data-value="/admin/account-management">
                <img src="${AccountIcon}" class="${styles["button-logo"]}">
            </div>
        </div>
    `;

    root.className = styles["header"];
}