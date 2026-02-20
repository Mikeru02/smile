import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/photographer.svg';

export default function Modal() {
    const modal = `
        <div class="${styles['modal']}" id="modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <h1>Client Details</h1>
                </div>
                <div class="${styles['center-container']}">
                    <div id="client-details">
                        <p><strong>Name:</strong> <span id="client-name"></span></p>
                        <p><strong>Email:</strong> <span id="client-email"></span></p>
                        <p><strong>Phone:</strong> <span id="client-phone"></span></p>
                        <p><strong>Address:</strong> <span id="client-address"></span></p>
                        <p><strong>Status:</strong> <span id="client-status"></span></p>
                        <p><strong>Created At:</strong> <span id="client-created"></span></p>
                    </div>
                </div>
                <div class="${styles['button-container']}">
                    <button id="exit" class="${styles["action-button"]}">Exit</button>
                    <button id="proceed" class="${styles["action-button"]}">Proceed</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}