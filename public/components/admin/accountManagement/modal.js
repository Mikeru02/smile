import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/details.svg';

export function Modal() {
    const modal = `
        <div class="${styles['modal']}" id="modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <div class="${styles['top-container-text']}">
                        <h1>Account Details</h1>
                        <p>Manage and View Client Information</p>
                    </div>
                </div>
                <div class="${styles['center-container']}">
                    <div id="client-details" class="${styles['details-grid']}">
                        <div class="${styles['form-group']}">
                            <label for="admin-name">Username</label>
                            <input type="text" id="admin-username" class="${styles['form-input']}" placeholder="Enter username">
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="admin-name">Name</label>
                            <input type="text" id="admin-name" class="${styles['form-input']}" placeholder="Enter name">
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="admin-role">Role</label>
                            <select id="admin-role" class="${styles['form-input']}">
                                <option value="staff">staff</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="admin-password">Password</label>
                            <input type="text" id="admin-password" class="${styles['form-input']}" placeholder="Enter password">
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="admin-created_at">Created At</label>
                            <input type="text" id="admin-created_at" class="${styles['form-input']}" placeholder="Enter client year / grade level">
                        </div>

                        <div class="${styles['form-group']}">
                            <button id="delete" class="${styles["action-button"]} ${styles["btn-delete"]}">Delete</button>
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

export function CreateModal() {
    const modal = `
        <div class="${styles['modal']}" id="create-modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <div class="${styles['top-container-text']}">
                        <h1>Create Account</h1>
                        <p>Create another account.</p>
                    </div>
                </div>
                <div class="${styles['center-container']}">
                    <div id="client-details" class="${styles['details-grid']}">
                        <div class="${styles['form-group']}">
                            <label for="admin-name">Username</label>
                            <input type="text" id="admin-username" class="${styles['form-input']}" placeholder="Enter username">
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="admin-name">Name</label>
                            <input type="text" id="admin-name" class="${styles['form-input']}" placeholder="Enter name">
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="admin-role">Role</label>
                            <select id="admin-role" class="${styles['form-input']}">
                                <option value="staff">staff</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>

                        <div class="${styles['form-group']}">
                            <label for="admin-password">Password</label>
                            <input type="text" id="admin-password" class="${styles['form-input']}" placeholder="Enter password">
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