import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/photographer.svg';

export default function Modal() {
    const modal = `
        <div class="${styles['modal']}" id="modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <h1>Drop Trash</h1>
                    <!-- <p class="${styles['span']}"><span class="${styles['close']}" id="closeModal">&times;</span></p> -->
                </div>
                <div class="${styles['center-container']}">
                    <h1>Capturing the Trash</h1>
                    <img src="${ILLUSTRATION1}" class="${styles['illustration']}">
                    <div>
                        <p>Drop trash before the timeout runs out</p>
                        <div class="${styles['progress-container']}">
                            <div class="${styles['progress-bar']}" id="progress-bar"></div>
                        </div>
                    </div>
                    <h1>Earned Time</p>
                    <p class="${styles['time-container']}"><span id="earn-hours-span" class="${styles['indiv-time']}">00</span> Hrs <span id="earn-min-span" class="${styles['indiv-time']}">00</span> Min <span id="earn-sec-span" class="${styles['indiv-time']}">00</span> Sec</p>
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