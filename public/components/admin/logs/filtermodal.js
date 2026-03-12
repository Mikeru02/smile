import styles from './component.module.css';

export default function FilterModal() {
    const modal = `
        <div class="${styles['modal']}" id="filter-modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <h2>Export Logs Filter</h2>
                    <p>Choose which logs to export</p>
                </div>
                <div class="${styles['filter-container']}">
                    <div class="${styles['filter-group']}">
                        <label for="filter-level">Log Level</label>
                        <select id="filter-level" class="${styles['filter-select']}">
                            <option value="">All Levels</option>
                            <option value="INFO">INFO</option>
                            <option value="WARN">WARN</option>
                            <option value="ERROR">ERROR</option>
                        </select>
                    </div>
                    
                    <div class="${styles['filter-group']}">
                        <label for="filter-date-from">Date From</label>
                        <input type="datetime-local" id="filter-date-from" class="${styles['filter-input']}">
                    </div>
                    
                    <div class="${styles['filter-group']}">
                        <label for="filter-date-to">Date To</label>
                        <input type="datetime-local" id="filter-date-to" class="${styles['filter-input']}">
                    </div>

                    <div class="${styles['filter-group']}">
                        <label for="filter-limit">Limit</label>
                        <input type="number" id="filter-limit" class="${styles['filter-input']}">
                    </div>
                </div>
                <div class="${styles['button-container']}">
                    <button id="cancel-filter" class="${styles['btn-cancel']}">Cancel</button>
                    <button id="apply-filter-export" class="${styles['btn-primary']}">Export Logs</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}