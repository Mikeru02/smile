import socketClient from "../../sockets/socketClient.js";
import { getRole } from "../../utils/getRole";

export default function AdminEvents(){
    const role = getRole(localStorage.getItem('token'));

    if (role === 'user') {
        window.app.pushRoute('/lost');
        return true;
    }

    socketClient.connect();
    socketClient.on('connect', () => {
        console.log('[SOCKET] Socket connected at', socketClient.id);
    })

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
            window.app.pushRoute('/')
        })
    }
}