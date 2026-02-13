import styles from "./component.module.css";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles["settings-container"]}">
            <div class="${styles["settings-header"]}">
                <h2>System Settings</h2>
                <div class="${styles["settings-actions"]}">
                    <button class="${styles["btn-primary"]}" id="save-settings">
                        <span>💾</span> Save Settings
                    </button>
                    <button class="${styles["btn-secondary"]}" id="reset-settings">
                        <span>🔄</span> Reset to Default
                    </button>
                </div>
            </div>
            
            <div class="${styles["settings-grid"]}">
                <!-- Time Settings -->
                <div class="${styles["settings-section"]}">
                    <h3 class="${styles["section-title"]}">⏰ Time Settings</h3>
                    <div class="${styles["settings-group"]}">
                        <div class="${styles["setting-item"]}">
                            <label for="session-timeout">Session Timeout (minutes)</label>
                            <input type="number" id="session-timeout" value="30" min="5" max="1440" class="${styles["setting-input"]}">
                            <small>Maximum time before automatic disconnection</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="idle-timeout">Idle Timeout (minutes)</label>
                            <input type="number" id="idle-timeout" value="15" min="1" max="60" class="${styles["setting-input"]}">
                            <small>Time before disconnecting inactive users</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="grace-period">Grace Period (seconds)</label>
                            <input type="number" id="grace-period" value="10" min="5" max="60" class="${styles["setting-input"]}">
                            <small>Additional time before session ends</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="time-format">Time Format</label>
                            <select id="time-format" class="${styles["setting-select"]}">
                                <option value="24h">24-hour (HH:MM:SS)</option>
                                <option value="12h">12-hour (HH:MM:SS AM/PM)</option>
                            </select>
                            <small>Display format for time remaining</small>
                        </div>
                    </div>
                </div>
                
                <!-- Network Settings -->
                <div class="${styles["settings-section"]}">
                    <h3 class="${styles["section-title"]}">🌐 Network Settings</h3>
                    <div class="${styles["settings-group"]}">
                        <div class="${styles["setting-item"]}">
                            <label for="max-clients">Maximum Clients</label>
                            <input type="number" id="max-clients" value="50" min="1" max="200" class="${styles["setting-input"]}">
                            <small>Maximum simultaneous connections</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="bandwidth-limit">Bandwidth Limit (Mbps)</label>
                            <input type="number" id="bandwidth-limit" value="10" min="1" max="100" class="${styles["setting-input"]}">
                            <small>Per-client bandwidth limit</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="data-limit">Data Limit (GB)</label>
                            <input type="number" id="data-limit" value="5" min="0.5" max="50" step="0.5" class="${styles["setting-input"]}">
                            <small>Daily data limit per client</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="wifi-channel">Wi-Fi Channel</label>
                            <select id="wifi-channel" class="${styles["setting-select"]}">
                                <option value="auto">Auto</option>
                                <option value="1">Channel 1</option>
                                <option value="6">Channel 6</option>
                                <option value="11">Channel 11</option>
                            </select>
                            <small>Wi-Fi broadcast channel</small>
                        </div>
                    </div>
                </div>
                
                <!-- System Settings -->
                <div class="${styles["settings-section"]}">
                    <h3 class="${styles["section-title"]}">⚙️ System Settings</h3>
                    <div class="${styles["settings-group"]}">
                        <div class="${styles["setting-item"]}">
                            <label for="auto-backup">Auto Backup</label>
                            <div class="${styles["toggle-switch"]}">
                                <input type="checkbox" id="auto-backup" checked>
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Automatically backup system data</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="backup-frequency">Backup Frequency</label>
                            <select id="backup-frequency" class="${styles["setting-select"]}">
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                            <small>How often to create backups</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="log-retention">Log Retention (days)</label>
                            <input type="number" id="log-retention" value="30" min="7" max="365" class="${styles["setting-input"]}">
                            <small>Days to keep system logs</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="maintenance-mode">Maintenance Mode</label>
                            <div class="${styles["toggle-switch"]}">
                                <input type="checkbox" id="maintenance-mode">
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Temporarily disable client connections</small>
                        </div>
                    </div>
                </div>
                
                <!-- Security Settings -->
                <div class="${styles["settings-section"]}">
                    <h3 class="${styles["section-title"]}">🔒 Security Settings</h3>
                    <div class="${styles["settings-group"]}">
                        <div class="${styles["setting-item"]}">
                            <label for="password-policy">Strong Password Policy</label>
                            <div class="${styles["toggle-switch"]}">
                                <input type="checkbox" id="password-policy" checked>
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Require complex passwords</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="session-encryption">Session Encryption</label>
                            <div class="${styles["toggle-switch"]}">
                                <input type="checkbox" id="session-encryption" checked>
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Encrypt client sessions</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="failed-attempts">Max Failed Attempts</label>
                            <input type="number" id="failed-attempts" value="5" min="3" max="10" class="${styles["setting-input"]}">
                            <small>Lockout after failed login attempts</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="lockout-duration">Lockout Duration (minutes)</label>
                            <input type="number" id="lockout-duration" value="15" min="5" max="60" class="${styles["setting-input"]}">
                            <small>Duration of account lockout</small>
                        </div>
                    </div>
                </div>
                
                <!-- Notification Settings -->
                <div class="${styles["settings-section"]}">
                    <h3 class="${styles["section-title"]}">🔔 Notification Settings</h3>
                    <div class="${styles["settings-group"]}">
                        <div class="${styles["setting-item"]}">
                            <label for="email-notifications">Email Notifications</label>
                            <div class="${styles["toggle-switch"]}">
                                <input type="checkbox" id="email-notifications" checked>
                                <span class="${styles["slider"]}"></span>
                            </div>
                            <small>Send system alerts via email</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="admin-email">Admin Email</label>
                            <input type="email" id="admin-email" value="admin@example.com" class="${styles["setting-input"]}">
                            <small>Email address for system notifications</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="alert-threshold">Alert Threshold (%)</label>
                            <input type="number" id="alert-threshold" value="80" min="50" max="95" class="${styles["setting-input"]}">
                            <small>System usage alert threshold</small>
                        </div>
                        
                        <div class="${styles["setting-item"]}">
                            <label for="notification-types">Notification Types</label>
                            <div class="${styles["checkbox-group"]}">
                                <label class="${styles["checkbox-label"]}">
                                    <input type="checkbox" checked> System Errors
                                </label>
                                <label class="${styles["checkbox-label"]}">
                                    <input type="checkbox" checked> High Usage
                                </label>
                                <label class="${styles["checkbox-label"]}">
                                    <input type="checkbox"> Client Disconnections
                                </label>
                                <label class="${styles["checkbox-label"]}">
                                    <input type="checkbox"> Maintenance Reminders
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="${styles["settings-footer"]}">
                <div class="${styles["status-message"]}" id="status-message">
                    Settings are ready to be saved
                </div>
                <div class="${styles["last-updated"]}">
                    Last updated: Never
                </div>
            </div>
        </div>
    `;

    root.className = styles["main"];
    
    // Initialize settings functionality
    initializeSettingsFunctionality();
}

function initializeSettingsFunctionality() {
    // Save settings button
    const saveBtn = document.getElementById('save-settings');
    saveBtn.addEventListener('click', saveSettings);
    
    // Reset settings button
    const resetBtn = document.getElementById('reset-settings');
    resetBtn.addEventListener('click', resetSettings);
    
    // Auto-save on input change
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateStatus('Settings modified - Click Save to apply changes');
        });
    });
}

function saveSettings() {
    console.log('Saving settings...');
    // Collect all settings
    const settings = {
        sessionTimeout: document.getElementById('session-timeout').value,
        idleTimeout: document.getElementById('idle-timeout').value,
        gracePeriod: document.getElementById('grace-period').value,
        timeFormat: document.getElementById('time-format').value,
        maxClients: document.getElementById('max-clients').value,
        bandwidthLimit: document.getElementById('bandwidth-limit').value,
        dataLimit: document.getElementById('data-limit').value,
        wifiChannel: document.getElementById('wifi-channel').value,
        autoBackup: document.getElementById('auto-backup').checked,
        backupFrequency: document.getElementById('backup-frequency').value,
        logRetention: document.getElementById('log-retention').value,
        maintenanceMode: document.getElementById('maintenance-mode').checked,
        passwordPolicy: document.getElementById('password-policy').checked,
        sessionEncryption: document.getElementById('session-encryption').checked,
        failedAttempts: document.getElementById('failed-attempts').value,
        lockoutDuration: document.getElementById('lockout-duration').value,
        emailNotifications: document.getElementById('email-notifications').checked,
        adminEmail: document.getElementById('admin-email').value,
        alertThreshold: document.getElementById('alert-threshold').value
    };
    
    // In real implementation, this would save to server
    console.log('Settings to save:', settings);
    updateStatus('Settings saved successfully!', 'success');
    updateLastUpdated();
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
        console.log('Resetting settings to default...');
        // In real implementation, this would reset to server defaults
        updateStatus('Settings reset to default values', 'info');
    }
}

function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
    statusElement.className = `${styles["status-message"]} ${styles[type]}`;
    
    // Clear status after 5 seconds
    setTimeout(() => {
        statusElement.textContent = 'Settings are ready to be saved';
        statusElement.className = styles["status-message"];
    }, 5000);
}

function updateLastUpdated() {
    const lastUpdatedElement = document.querySelector(`.${styles["last-updated"]}`);
    const now = new Date();
    lastUpdatedElement.textContent = `Last updated: ${now.toLocaleString()}`;
}