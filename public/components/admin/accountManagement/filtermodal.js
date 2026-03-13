import styles from './component.module.css';

export default function FilterModal() {
    const today = new Date().toISOString().split('T')[0];
    const modal = `
        <div class="${styles['modal']}" id="filter-modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <h2>Apply Accounts Filter</h2>
                    <p>Choose which accounts to filter</p>
                </div>
                <div class="${styles['filter-container']}">
                    <div class="${styles['filter-group']}">
                        <label for="filter-role">Log Level</label>
                        <select id="filter-role" class="${styles['filter-select']}">
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    
                    <div class="${styles['filter-group']}">
                        <label for="filter-date-from">Last Login From</label>
                        <input type="date" id="filter-date-from" class="${styles['filter-input']}" max="${today}">
                    </div>
                    
                    <div class="${styles['filter-group']}">
                        <label for="filter-date-to">Last Login To</label>
                        <input type="date" id="filter-date-to" class="${styles['filter-input']}" max="${today}">
                    </div>

                    <div class="${styles['filter-group']}">
                        <label for="filter-limit">Limit</label>
                        <input type="number" id="filter-limit" class="${styles['filter-input']}">
                    </div>
                </div>
                <div class="${styles['button-container']}">
                    <button id="cancel-filter" class="${styles['btn-cancel']}">Cancel</button>
                    <button id="apply-filter" class="${styles['btn-primary']}">Apply Filters</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}