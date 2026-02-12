import styles from "./component.module.css";

export default function NavLink(textContent, imgSvg, className, dataValue, id) {
    return `
        <div class="${className}" data-value="${dataValue}" id="${id}">
            <img src="${imgSvg}" class="${styles["nav-icon"]}">
            <span class="${styles["nav-text"]}">${textContent}</span>
        </div>
    `;
}