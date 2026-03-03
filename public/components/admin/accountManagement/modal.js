import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/details.svg';

export default function Modal() {
    const modal = `
        <div class="${styles['modal']}" id="modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <div class="${styles['top-container-text']}">
                        <h1>Account Details Details</h1>
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
                            <label for="client-course">Course</label>
                            <select id="client-course" class="${styles['form-input']}">
                                <option value="BSCS">BSCS</option>
                                <option value="BEED">BEED</option>
                                <option value="BSED">BSED</option>
                                <option value="BSHM">BSHM</option>
                                <option value="BSBA">BSBA</option>
                                <option value="BSA">BSA</option>
                                <option value="STEM">STEM</option>
                                <option value="HUMSS">HUMSS</option>
                                <option value="TVL">TVL</option>
                                <option value="ABM">ABM</option>
                            </select>
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="client-name">Year / Grade Level</label>
                            <input type="text" id="client-yearlevel" class="${styles['form-input']}" placeholder="Enter client year / grade level">
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="client-status">Status</label>
                            <select id="client-status" class="${styles['form-input']}">
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="pending">Pending</option>
                                <option value="dropping">Dropping</option>
                                <option value="outOfTime">Out of Time</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="client-timeRemaining">Time Remaining (in Seconds)</label>
                            <input type="text" id="client-timeRemaining" class="${styles['form-input']}" placeholder="Enter time remaining">
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-timeEarned">Time Earned (in Seconds)</label>
                            <input type="text" id="client-timeEarned" class="${styles['form-input']}" placeholder="Enter time earned">
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-wasteCollected">Waste Collected</label>
                            <input type="text" id="client-wasteCollected" class="${styles['form-input']}" readonly>
                        </div>
                        <div class="${styles['form-group']}">
                            <label for="client-createdAt">Created At</label>
                            <input type="text" id="client-createdAt" class="${styles['form-input']}" readonly>
                        </div>
                    </div>
                </div>
                <div class="${styles['button-container']}">
                    <button id="exit" class="${styles["action-button"]} ${styles["btn-cancel"]}">Cancel</button>
                    <button id="save" class="${styles["action-button"]} ${styles["btn-save"]}">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}