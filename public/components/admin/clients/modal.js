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
                    <div id="client-details">
                        <p><strong>Name:</strong> <span id="client-name"></span></p>
                        <p><strong>IP:</strong> <span id="client-ip"></span></p>
                        <p><strong>Status:</strong> <span id="client-status"></span></p>
                        <p><strong>Time Remaining:</strong> <span id="client-timeRemaining"></span></p>
                        <p><strong>Time Earned:</strong> <span id="client-timeEarned"></span></p>
                        <p><strong>Waste Collected:</strong> <span id="client-wasteCollected"></span></p>
                        <p><strong>Created At:</strong> <span id="client-createdAt"></span></p>

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