import styles from "./component.module.css";

export default function MainContent(root) {
    // Calculate server uptime (example - in real app, this would come from server)
    const serverStartTime = new Date('2024-01-01T00:00:00');
    const uptime = calculateUptime(serverStartTime);
    
    root.innerHTML = `
        <div class="${styles["dashboard-container"]}">
            <!-- Section 1: System Status -->
            <div class="${styles["section"]}">
                <h2 class="${styles["section-title"]}">System Status</h2>
                <div class="${styles["dashboard-grid"]}">
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">  
                            <h3>Server Status</h3>
                            <div class="${styles["status-indicator"]} ${styles["online"]}"></div>
                        </div>
                        <p class="${styles["stats"]}"><span>${uptime.days}</span>Days</p>
                        <p class="${styles["sub-stats"]}">${uptime.hours}h ${uptime.minutes}m uptime</p>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Model Status</h3>
                            <div class="${styles["icon"]}">🤖</div>
                        </div>
                        <p class="${styles["stats"]}"><span>Active</span></p>
                        <p class="${styles["sub-stats"]}">AI Model Running</p>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Internet Status</h3>
                            <div class="${styles["icon"]}">🌐</div>
                        </div>
                        <p class="${styles["stats"]}"><span>Connected</span></p>
                        <p class="${styles["sub-stats"]}">Network Online</p>
                    </div>
                </div>
            </div>
            
            <!-- Section 2: User Metrics -->
            <div class="${styles["section"]}">
                <h2 class="${styles["section-title"]}">User Metrics</h2>
                <div class="${styles["dashboard-grid"]}">
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Total Users</h3>
                            <div class="${styles["icon"]}">👥</div>
                        </div>
                        <p class="${styles["stats"]}"><span>0</span>Registered</p>
                        <p class="${styles["sub-stats"]}">All time users</p>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Active Sessions</h3>
                            <div class="${styles["icon"]}">📱</div>
                        </div>
                        <p class="${styles["stats"]}"><span>0</span>Connected</p>
                        <p class="${styles["sub-stats"]}">Currently online</p>
                    </div>
                </div>
            </div>
            
            <!-- Section 3: Waste Collection -->
            <div class="${styles["section"]}">
                <h2 class="${styles["section-title"]}">Waste Collection</h2>
                <div class="${styles["dashboard-grid"]}">
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Today's Collection</h3>
                            <div class="${styles["icon"]}">♻️</div>
                        </div>
                        <p class="${styles["stats"]}"><span>0</span>items</p>
                        <p class="${styles["sub-stats"]}">Total collected today</p>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Waste Breakdown</h3>
                            <div class="${styles["icon"]}">📦</div>
                        </div>
                        <div class="${styles["waste-stats"]}">
                            <div class="${styles["waste-item"]}">
                                <span class="${styles["waste-label"]}">Paper:</span>
                                <span class="${styles["waste-value"]}">0 items</span>
                            </div>
                            <div class="${styles["waste-item"]}">
                                <span class="${styles["waste-label"]}">Plastic:</span>
                                <span class="${styles["waste-value"]}">0 items</span>
                            </div>
                            <div class="${styles["waste-item"]}">
                                <span class="${styles["waste-label"]}">General:</span>
                                <span class="${styles["waste-value"]}">0 items</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Data Usage</h3>
                            <div class="${styles["icon"]}">📊</div>
                        </div>
                        <p class="${styles["stats"]}"><span>0</span>GB</p>
                        <p class="${styles["sub-stats"]}">Total consumed</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    root.className = styles["main"];
    
    // Start real-time updates
    startRealTimeUpdates();
}

function calculateUptime(startTime) {
    const now = new Date();
    const diff = now - startTime;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
}

function startRealTimeUpdates() {
    // Update uptime every minute
    setInterval(() => {
        // In real implementation, fetch updated data from server
        console.log('Updating dashboard stats...');
    }, 60000);
}