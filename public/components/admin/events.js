import { getRole } from "../../utils/getRole";
import socketClient from "../../sockets/socketInstance.js";

export default function AdminEvents(){
    const role = getRole(localStorage.getItem('token'));

    if (role === 'user') {
        window.app.pushRoute('/lost');
        return true;
    }

    // Add refresh button functionality
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Reload the current page to refresh all data
            window.location.reload();
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            document.title = "S.M.I.L.E - Portal";
            socketClient.disconnect();
            window.app.pushRoute('/')
        })
    }
}