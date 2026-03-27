import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/wrong.svg';

export default function Modal() {
    const modal = `
        <div class="${styles['modal']}" id="modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <h1>Oops!</h1>
                </div>
                <div class="${styles['center-container']}">
                    <img src="${ILLUSTRATION1}" class="${styles['illustration']}">
                    <h1 id="message-container"></h1>
                </div>
                <div class="${styles['button-container']}">
                    <button id="ok-button" class="${styles["okay-button"]}">Okay</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}