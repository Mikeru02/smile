import Logo from '/icons/logo.svg';
import OpenEye from '/icons/open-eye.svg';
import Modal from './modal';
import CloseEye from '/icons/close-eye.svg';
import styles from './component.module.css';

export default function Main(root) {
    root.innerHTML = `
        <div class="${styles["card"]}">
            <img src=${Logo} class="${styles["logo"]}">
            <h1 class="${styles["title"]}">S.M.I.L.E - Admin</h1>
            <p class="${styles["desc"]}">Log In</p>

            <div class="${styles["input-fields"]}">
                <label for="username">Username</label>
                <input type="text" name="username" placeholder="Username" id="username" autocomplete="off">
                <label for="password">Password</label>
                <div class="${styles["password-wrapper"]}">
                    <input type="password" name="password" placeholder="Password" id="password" autocomplete="new-password">
                    <button type="button" id="toggle-password" class="${styles["toggle-password"]}">
                        <img id="eye-icon" src="${CloseEye}" alt="Show password" class="${styles["eye-icon"]}">
                    </button>
                </div>
            </div>
            <button id="submit-login" class="${styles["button-submit-cred"]}">Log In</button>
        </div>
        ${Modal()}
    `;

    root.className = styles["main"];
}