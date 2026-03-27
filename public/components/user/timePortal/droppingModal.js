import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/dropping.svg';

export default function DroppingModal() {
    const modal = `
        <div class="${styles['modal']}" id="dropping-modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['top-container']}">
                    <h1>Another User is Dropping</h1>
                    <!-- <p class="${styles['span']}"><span class="${styles['close']}" id="closeModal">&times;</span></p> -->
                </div>
                <div class="${styles['center-container']}">
                    <h1>Please Wait</h1>
                    <img src="${ILLUSTRATION1}" class="${styles['illustration']}">
                    <p>Another client is currently dropping trash. Please wait for them to finish.</p>
                </div>
                <div class="${styles['button-container']}">
                    <button id="ok-button" class="${styles["okay-button"]}">Okay</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}