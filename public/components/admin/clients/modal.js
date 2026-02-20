import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/details.svg';

export default function Modal() {
    const modal = `
        <div class="${styles['modal']}" id="modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <img src="${ILLUSTRATION1}">
                    <div class="${styles['top-container-text']}">
                        <h1>Client Details</h1>
                        <p>Manage and View Client Information</p>
                    </div>
                </div>
                <div class="${styles['center-container']}">
                    <div id="client-details" class="${styles['details-grid']}">
                        <div class="${styles['form-group']}">
                            <label for="client-name">Name</label>
                            <input type="text" id="client-name" class="${styles['form-input']}" placeholder="Enter client name">
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-status">Status</label>
                            <select id="client-status" class="${styles['form-input']}">
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="dropping">Dropping</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-timeRemaining">Time Remaining</label>
                            <input type="text" id="client-timeRemaining" class="${styles['form-input']}" placeholder="Enter time remaining">
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-timeEarned">Time Earned</label>
                            <input type="text" id="client-timeEarned" class="${styles['form-input']}" placeholder="Enter time earned">
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-wasteCollected">Waste Collected</label>
                            <input type="text" id="client-wasteCollected" class="${styles['form-input']}" placeholder="Enter waste collected">
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-createdAt">Created At</label>
                            <input type="text" id="client-createdAt" class="${styles['form-input']}" readonly>
                        </div>
                    </div>
                </div>
                <div class="${styles['button-container']}">
                    <button id="exit" class="${styles["action-button"]} ${styles["btn-cancel"]}">Cancel</button>
                    <button id="proceed" class="${styles["action-button"]} ${styles["btn-save"]}">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}