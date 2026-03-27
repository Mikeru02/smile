import ILLUSTRATION from '../../icons/lost.svg';
import styles from './component.module.css';

export default function Main(root) {
    root.innerHTML = `
        <div class="${styles['card']}">
            <img src="${ILLUSTRATION}">
            <p>Being cleaver, I see. I already planned for this</p>
            <button class="${styles["back-button"]}" id="back-button">Back to Portal</button>
        </div>
    `

    root.className = styles['main'];
}