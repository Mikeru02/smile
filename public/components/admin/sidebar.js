import styles from "./component.module.css";
import Logo from "/icons/logo2.svg";
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
                <div class="${styles["nav-item"]}" data-value="/admin/dashboard">
                    <img src="${HomeIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Dashboard</span>
                </div>
                <div class="${styles["nav-item"]}" data-value="/admin/machine">
                    <img src="${MachineIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Machine</span>
                </div>
                <div class="${styles["nav-item"]}" data-value="/admin/clients">
                    <img src="${ClientIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Clients</span>
                </div>
                <div class="${styles["nav-item"]}" data-value="/admin/logs">
                    <img src="${LogsIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Logs</span>
                </div>
                <div class="${styles["nav-item"]}" data-value="/admin/settings">
                    <img src="${SettingsIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Settings</span>
                </div>
                <div class="${styles["nav-item"]}" data-value="/admin/account-management">
                    <img src="${AccountIcon}" class="${styles["nav-icon"]}">
                    <span class="${styles["nav-text"]}">Accounts</span>
                </div>
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

    const navItems = root.querySelectorAll(`.${styles["nav-item"]}:not(.${styles["logout-btn"]})`);

    function setActiveLink() {
        const currentPath = window.location.pathname;
        navItems.forEach(item => {
            if (item.dataset.value === currentPath) {
                item.classList.add(styles["active"]);
            } else {
                item.classList.remove(styles["active"]);
            }
        });
    }

    // Set active link on initial load
    setActiveLink();

    // Add event listeners for navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const path = item.dataset.value;
            if (path) {
                window.history.pushState({}, '', path);
                setActiveLink();
                // Here you would typically load the content for the new path
                // For this example, we'll just update the active link
            }
        });
    });

    // Listen for browser's back/forward buttons
    window.addEventListener('popstate', setActiveLink);

    // Add refresh functionality
    const refreshBtn = root.querySelector('#refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Refresh the current page
            window.location.reload();
        });
    }

    // Add logout functionality
    const logoutBtn = root.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear authentication token
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            
            // Redirect to login page
            window.location.href = '/login';
        });
    }
}
