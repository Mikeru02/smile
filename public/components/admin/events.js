import styles from "./component.module.css";

export default function AdminEvents(){
    document.title = "S.M.I.L.E - Admin";
    
    // Add refresh button functionality
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Reload the current page to refresh all data
            window.location.reload();
        });
    }
}