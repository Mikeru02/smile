import styles from "./component.module.css";
import Modal from "./modal.js";
import FilterModal from "./filtermodal.js";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles["clients-container"]}">
            <div class="${styles["table-header"]}">
                <div class="${styles["table-actions"]}">
                    <button class="${styles["btn-secondary"]}" id="export-btn">
                        <span>📥</span> Export Data
                    </button>
                </div>
            </div>
            
            <div class="${styles["table-wrapper"]}">
                <table class="${styles["clients-table"]}" id="clients-table">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            
            <!--
            <div class="${styles["table-footer"]}">
                <div class="${styles["pagination-info"]}">
                    Showing of clients
                </div>
                <div class="${styles["pagination-controls"]}">
                    <button class="${styles["btn-pagination"]}" id="prev-page">Previous</button>
                    <span class="${styles["page-info"]}>Page 1 of 1</span>
                    <button class="${styles["btn-pagination"]}" id="next-page">Next</button>
                </div>
            </div>
            -->
        </div>
        ${Modal()}
        ${FilterModal()}
    `;

    root.className = styles["main"];
}

