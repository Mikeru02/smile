import styles from "./component.module.css";
import Modal from "./modal.js";

export default function MainContent(root) {
    root.innerHTML = `
        <div class="${styles["accounts-container"]}">
            <div class="${styles["accounts-header"]}">
                <div class="${styles["accounts-actions"]}">
                    <button class="${styles["btn-primary"]}" id="add-account">
                        <span>➕</span> Add Account
                    </button>
                </div>
            </div>
            
            <div class="${styles["accounts-wrapper"]}">
                <table class="${styles["accounts-table"]}" id="accounts-table">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            
            <!--
            <div class="${styles["accounts-footer"]}">
                <div class="${styles["pagination-info"]}">
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
    `;

    root.className = styles["main"];
}