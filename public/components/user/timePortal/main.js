import styles from './component.module.css';
import Modal from './modal.js';
import DroppingModal from './droppingModal.js';
import Logo from '/icons/logo.svg';
import ILLUSTRATION1 from '/icons/time.svg';

export default function Main(root) {
    root.innerHTML = `
        <div class="${styles["card"]}">
            <img src="${Logo}" class="${styles["logo"]}">
            <h1 class="${styles["title"]}">S.M.I.L.E</h1>
            <p class="${styles["desc"]}">Time Management Portal</p>
            <div id="internet-annoucement">
                <p>⚠️ No Internet. Please wait</p>
            </div>
            <img src="${ILLUSTRATION1}" class="${styles['illustration']}">
            <p class="${styles['time-remaining']}">Time Remaining</p>
            <p class="${styles['time-container']}"><span id="hours-span" class="${styles['indiv-time']}">00</span> Hrs <span id="min-span" class="${styles['indiv-time']}">00</span> Min <span id="sec-span" class="${styles['indiv-time']}">00</span> Sec</p>
            <button id="start-drop" class="${styles["button-submit-cred"]}">Drop Trash</button>
            <button id="connect" class="${styles["button-submit-cred"]}">Connect</button>
        </div>
        ${Modal()}
        ${DroppingModal()}
    `;

    root.className = styles['main'];
}