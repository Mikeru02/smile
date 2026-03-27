import styles from "./component.module.css";
import FilterModal from "./filtermodal";

export default function MainContent(root) {
    // Sample log data - in real app, this would come from server
    root.innerHTML = `
        <div class="${styles["logs-container"]}">
            <div class="${styles["logs-header"]}">
                <div class="${styles["logs-actions"]}">
                    <button class="${styles["btn-secondary"]}" id="clear-btn">Clear</button>
                    <button class="${styles["btn-secondary"]}" id="filter-btn">
                        <span>📥</span> Filter
                    </button>
                    <button class="${styles["btn-primary"]}" id="export-btn">
                        <span>📥</span> Export Logs
                    </button>
                </div>
            </div>
            
            <div class="${styles["logs-wrapper"]}">
                <table class="${styles["logs-table"]}" id="logs-table">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            <!--
            <div class="${styles["logs-footer"]}">
                <div class="${styles["pagination-info"]}">
                </div>
                <div class="${styles["pagination-controls"]}">
                    <button class="${styles["btn-pagination"]}" id="prev-page">Previous</button>
                    <span class="${styles["page-info"]}>Page 1 of 1</span>
                    <button class="${styles["btn-pagination"]}" id="next-page">Next</button>
                </div>
            </div>
            -->
            ${FilterModal()}
        </div>
    `;

    root.className = styles["main"];
}