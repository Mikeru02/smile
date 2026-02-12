import styles from "./component.module.css";
import Logo from "/icons/logo2.svg";
import NavLink from "./navLink.js";
import HomeIcon from "/icons/dashboard.svg";
import MachineIcon from "/icons/machine.svg";
import ClientIcon from "/icons/client.svg";
import LogsIcon from "/icons/logs.svg";
import SettingsIcon from "/icons/settings.svg";
import AccountIcon from "/icons/accountManagement.svg";
import LogoutIcon from "/icons/logout.svg";
import RefreshIcon from "/icons/refresh.svg";

export default function Sidebar(root) {
    root.innerHTML = `
        <div class="${styles["sidebar-container"]}">
            <div class="${styles["logo-title"]}">
                <img src="${Logo}" class="${styles["logo"]}">
                <h1 class="${styles["title-logo"]}">SMILE</h1>
            </div>
            <nav class="${styles["nav-menu"]}">
                ${NavLink("Dashboard", HomeIcon, styles["nav-item"], "/admin/dashboard", null)}
                ${NavLink("Machine", MachineIcon, styles["nav-item"], "/admin/machine", null)}
                ${NavLink("Clients", ClientIcon, styles["nav-item"], "/admin/clients", null)}
                ${NavLink("Logs", LogsIcon, styles["nav-item"], "/admin/logs", null)}
                ${NavLink("Settings", SettingsIcon, styles["nav-item"], "/admin/settings", null)}
                ${NavLink("Accounts", AccountIcon, styles["nav-item"], "/admin/account-management", null)}
            </nav>
            <div class="${styles["logout-section"]}">
                <div class="${styles["nav-item"]} ${styles["refresh-btn"]}" id="refresh-btn">
                    <img src="${RefreshIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Refresh</span>
                </div>
                <div class="${styles["nav-item"]} ${styles["logout-btn"]}" id="logout-btn">
                    <img src="${LogoutIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Logout</span>
                </div>
            </div>
        </div>
    `;

    root.className = styles["sidebar"];
}
