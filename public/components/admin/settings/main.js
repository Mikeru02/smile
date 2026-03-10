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
                            <div class="${styles["switch"]}" id="utility">
                                <input type="checkbox" id="utility-checkbox">
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Enable ulity mode</small>
                        </div>

                        <div class="${styles["setting-item"]}">
                            <label for="auto-backup">Enable Auto Backup</label>
                            <div class="${styles["switch"]}" id="auto-backup">
                                <input type="checkbox" id="backup-checkbox">
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

                        <div class="${styles["setting-item"]}">
                            <div>
                                <button class="${styles['save-default']}" id="restore-now">Restore Defaults</button>
                                <button class="${styles['save-default']}" id="save-now">Save Settings</button>
                            </div>
                        </div>

                        <div class="${styles["setting-item"]}">
                            <button class="${styles['backup-now']}" id="backup-now">Back Up Now</button>
                        </div>
                    </div>
                </div>
            
                
            </div>
        </div>
    `;

    root.className = styles["main"];
}