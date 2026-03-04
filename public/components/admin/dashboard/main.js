import styles from "./component.module.css";

export default function MainContent(root) {
    // Calculate server uptime (example - in real app, this would come from server)
    
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
                        <p class="${styles["stats"]}"><span id="days">Loading...</span>Days</p>
                        <p class="${styles["sub-stats"]}" id="hours-mins">Loading uptime...</p>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Model Status</h3>
                            <div class="${styles["icon"]}">🤖</div>
                        </div>
                        <p class="${styles["stats"]}"><span id="model-stat">Loading...</span></p>
                        <p class="${styles["sub-stats"]}" id="model-substat">Loading...</p>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Internet Status</h3>
                            <div class="${styles["icon"]}">🌐</div>
                        </div>
                        <p class="${styles["stats"]}"><span id="internet-stat">Loading...</span></p>
                        <p class="${styles["sub-stats"]}" id="internet-substat">Loading...</p>
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
                        <p class="${styles["stats"]}"><span id="total-clients">Loading...</span>Registered</p>
                        <p class="${styles["sub-stats"]}">All time users</p>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Active Sessions</h3>
                            <div class="${styles["icon"]}">📱</div>
                        </div>
                        <p class="${styles["stats"]}"><span id="active-clients">Loading...</span>Connected</p>
                        <p class="${styles["sub-stats"]}">Currently online</p>
                    </div>
                </div>
            </div>
            
            <div class="${styles["section"]}">
                <h2 class="${styles["section-title"]}">Most Visited Sites</h2>
                <div class="${styles["dashboard-grid"]}" id='dashboard-grid'>
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Top 1</h3>
                            <div class="${styles["icon"]}">🥇</div>
                        </div>
                        <p class="${styles["stats"]}"><span id="top-first">Loading...</span>Items</p>
                        <p class="${styles["sub-stats"]}">Total visits: <span id='top-first-visit'>Loading...</span></p>
                    </div>
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Top 2</h3>
                            <div class="${styles["icon"]}">🥈</div>
                        </div>
                        <p class="${styles["stats"]}"><span id="top-second">Loading...</span>Items</p>
                        <p class="${styles["sub-stats"]}">Total visits: <span id='top-second-visit'>Loading...</span><</p>
                    </div>
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Top 3</h3>
                            <div class="${styles["icon"]}">🥉</div>
                        </div>
                        <p class="${styles["stats"]}"><span id="top-third">Loading...</span>Items</p>
                        <p class="${styles["sub-stats"]}">Total visits: <span id='top-third-visit'>Loading...</span><</p>
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
                        <p class="${styles["stats"]}"><span id="waste-items">Loading...</span>Items</p>
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
                                <span class="${styles["waste-value"]}" id="paper">Loading items...</span>
                            </div>
                            <div class="${styles["waste-item"]}">
                                <span class="${styles["waste-label"]}">Plastic Bottle:</span>
                                <span class="${styles["waste-value"]}" id="plastic-bottle">Loading items...</span>
                            </div>
                            <div class="${styles["waste-item"]}">
                                <span class="${styles["waste-label"]}">General:</span>
                                <span class="${styles["waste-value"]}" id="general">Loading items...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="${styles["card"]}">
                        <div class="${styles["card-header"]}">
                            <h3>Full Bin Count</h3>
                            <div class="${styles["icon"]}">🗑️</div>
                        </div>
                        <p class="${styles["stats"]}"><span id="bin-count">Loading...</span>Bins</p>
                        <p class="${styles["sub-stats"]}">Total full bins collected</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    root.className = styles["main"];
}