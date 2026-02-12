import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles["machine-container"]}">
            <div class="${styles["placeholder-grid"]}">
                <div class="${styles["placeholder-card"]}">
                    <h3>🖥️ CPU Information</h3>
                    <div class="${styles["placeholder-content"]}">
                        <p>Processor Type: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Number of Cores: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>CPU Speed: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Current Usage: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                    </div>
                </div>
                
                <div class="${styles["placeholder-card"]}">
                    <h3>💾 Memory Information</h3>
                    <div class="${styles["placeholder-content"]}">
                        <p>Total RAM: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Available RAM: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Used RAM: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Memory Type: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                    </div>
                </div>
                
                <div class="${styles["placeholder-card"]}">
                    <h3>💿 Storage Information</h3>
                    <div class="${styles["placeholder-content"]}">
                        <p>Total Storage: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Used Space: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Available Space: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Storage Type: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                    </div>
                </div>
                
                <div class="${styles["placeholder-card"]}">
                    <h3>🌐 Network Information</h3>
                    <div class="${styles["placeholder-content"]}">
                        <p>IP Address: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Network Interface: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Gateway: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>DNS Servers: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                    </div>
                </div>
                
                <div class="${styles["placeholder-card"]}">
                    <h3>⚙️ System Information</h3>
                    <div class="${styles["placeholder-content"]}">
                        <p>Operating System: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Kernel Version: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>System Uptime: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Architecture: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                    </div>
                </div>
                
                <div class="${styles["placeholder-card"]}">
                    <h3>🔄 Process Information</h3>
                    <div class="${styles["placeholder-content"]}">
                        <p>Total Processes: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Running Processes: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>Sleeping Processes: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                        <p>System Load: <span class="${styles["placeholder-value"]}">Loading...</span></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    root.className = styles["main"];
}