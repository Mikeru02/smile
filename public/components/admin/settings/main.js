import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles["settings-container"]}">
            <div class="${styles["settings-grid"]}">
                <!-- Content Filtering Settings -->
                <div class="${styles["settings-section"]}">
                    <h3 class="${styles["section-title"]}">🚫 Content Filtering</h3>
                    <div class="${styles["settings-group"]}">
                        <div class="${styles["setting-item"]}">
                            <label>Prohibited Domains</label>
                            <div class="${styles["domain-list"]}" id="domain-list">
                                <div class="${styles["domain-item"]}">
                                    <span>example.com</span>
                                    <button class="${styles["remove-btn"]}" onclick="#">×</button>
                                </div>
                            </div>
                        </div>
                        <div class="${styles["add-domain-container"]}">
                            <input type="text" id="new-domain" placeholder="Enter domain to block" class="${styles["setting-input"]}">
                            <button class="${styles["add-btn"]}" id="add-domain-btn">Add Domain</button>
                        </div>
                        <small>Manage blocked domains and links</small>
                    </div>
                </div>
                
                <!-- Backup Settings -->
                <div class="${styles["settings-section"]}">
                    <h3 class="${styles["section-title"]}">💾 General Settings</h3>
                    <div class="${styles["settings-group"]}">
                        <div class="${styles["setting-item"]}">
                            <label for="utility">Enable Utility Mode</label>
                            <div class="${styles["switch"]}">
                                <input type="checkbox" id="utility">
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Enable ulity mode</small>
                        </div>

                        <div class="${styles["setting-item"]}">
                            <label for="auto-backup">Enable Auto Backup</label>
                            <div class="${styles["switch"]}">
                                <input type="checkbox" id="auto-backup">
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Automatically backup database</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="backup-frequency">Backup Frequency</label>
                            <select id="backup-frequency" class="${styles["setting-select"]}">
                                <option value="hourly">Hourly</option>
                                <option value="daily" selected>Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                            <small>How often to create backups</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="backup-location">Backup Location</label>
                            <input type="text" id="backup-location" value="/backups/system" class="${styles["setting-input"]}">
                            <small>Directory to store backup files</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="backup-retention">Backup Retention (days)</label>
                            <input type="number" id="backup-retention" value="30" min="7" max="365" class="${styles["setting-input"]}">
                            <small>Days to keep backup files</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="backup-compression">Backup Compression</label>
                            <select id="backup-compression" class="${styles["setting-select"]}">
                                <option value="none">No Compression</option>
                                <option value="gzip" selected>Gzip (.gz)</option>
                                <option value="zip">Zip (.zip)</option>
                            </select>
                            <small>Compression format for backups</small>
                        </div>
                    </div>
                </div>
            
                
            </div>
        </div>
    `;

    root.className = styles["main"];

    // Add event listeners for toggle switches
    const utilityToggle = root.querySelector('#utility');
    const autoBackupToggle = root.querySelector('#auto-backup');

    if (utilityToggle) {
        utilityToggle.addEventListener('change', function() {
            console.log('Utility mode:', this.checked);
            // Add your utility mode logic here
            updateSetting('utility', this.checked);
        });
    }

    if (autoBackupToggle) {
        autoBackupToggle.addEventListener('change', function() {
            console.log('Auto backup:', this.checked);
            // Add your auto backup logic here
            updateSetting('auto-backup', this.checked);
        });
    }

    // Function to update settings (you can customize this)
    function updateSetting(setting, value) {
        // Save to localStorage or send to server
        localStorage.setItem(`setting-${setting}`, value);
        
        // Show status message (optional)
        showStatusMessage(`${setting} ${value ? 'enabled' : 'disabled'}`);
    }

    // Function to show status messages (optional)
    function showStatusMessage(message) {
        const existingMessage = root.querySelector('.status-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'status-message info';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0.8rem 1.2rem;
            border-radius: 0.6rem;
            background: linear-gradient(135deg, #d1ecf1, #bee5eb);
            border: 2px solid #17a2b8;
            color: #0c5460;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    // Load saved settings on init
    function loadSettings() {
        const utilitySaved = localStorage.getItem('setting-utility');
        const autoBackupSaved = localStorage.getItem('setting-auto-backup');

        if (utilitySaved !== null && utilityToggle) {
            utilityToggle.checked = utilitySaved === 'true';
        }

        if (autoBackupSaved !== null && autoBackupToggle) {
            autoBackupToggle.checked = autoBackupSaved === 'true';
        }
    }

    loadSettings();
}