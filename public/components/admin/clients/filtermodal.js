import styles from './component.module.css';

export default function FilterModal() {
    const today = new Date().toISOString().split('T')[0];
    const modal = `
        <div class="${styles['modal']}" id="filter-modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <h2>Client Filter</h2>
                    <p>Choose which client to filter</p>
                </div>
                <div class="${styles['filter-container']}">
                    <div class="${styles['filter-group']}">
                        <label for="filter-logedin">Logged In</label>
                        <select id="filter-logedin" class="${styles['filter-select']}">
                            <option value="">None</option>
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>

                    <div class="${styles['filter-group']}">
                        <label for="filter-status">Status</label>
                        <select id="filter-status" class="${styles['filter-select']}">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                        </select>
                    </div>
                    
                    <div class="${styles['filter-group']}">
                        <label for="filter-date-from">Date From</label>
                        <input type="date" id="filter-date-from" class="${styles['filter-input']}" max="${today}">
                    </div>
                    
                    <div class="${styles['filter-group']}">
                        <label for="filter-date-to">Date To</label>
                        <input type="date" id="filter-date-to" class="${styles['filter-input']}" max="${today}">
                    </div>

                    <div class="${styles['filter-group']}">
                        <label for="filter-limit">Limit</label>
                        <input type="number" id="filter-limit" class="${styles['filter-input']}" value=30>
                    </div>
                </div>
                <div class="${styles['button-container']}">
                    <button id="cancel-filter" class="${styles['btn-cancel']}">Cancel</button>
                    <button id="apply-filter" class="${styles['btn-primary']}">Apply Filter</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}