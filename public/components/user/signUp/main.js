import Logo from '/icons/logo.svg';
import styles from './component.module.css';
import CloseEye from '/icons/close-eye.svg';

export default function Main(root){
    root.innerHTML = `
        <div class="${styles["card"]}">
            <img src="${Logo}" class="${styles["logo"]}" id="logo">
            <h1 class="${styles["title"]}">S.M.I.L.E</h1>
            <p class="${styles["desc"]}">
                <p>Sigup Form</p>
                <p>Input Credentials</p>
            </p>
            <!-- From Uiverse.io by Yaya12085 --> 
            <div class="${styles["input-fields"]}" id="input-fields">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" placeholder="Enter username" autocomplete="off">
                <label for="password">Password</label>
                <div class="${styles["password-wrapper"]}">
                    <input type="password" name="password" placeholder="Password" id="password" autocomplete="new-password">
                    <button type="button" id="toggle-password" class="${styles["toggle-password"]}">
                        <img id="eye-icon" src="${CloseEye}" alt="Show password" class="${styles["eye-icon"]}">
                    </button>
                </div>
                <label for="confirm-password">Confirm Password</label>
                <div class="${styles["password-wrapper"]}">
                    <input type="password" name="confirm-password" placeholder="Confirm Password" id="confirm-password" autocomplete="new-password">
                    <button type="button" id="toggle-password" class="${styles["toggle-password"]}">
                        <img id="eye-icon" src="${CloseEye}" alt="Show password" class="${styles["eye-icon"]}">
                    </button>
                </div>
            </div>
            <div class="${styles["consent-container"]}">
                <input type="checkbox" id="consent" name="consent">
                <label for="consent">I agree to <a href="/terms-and-conditions">Terms and Conditions</a></label>
            </div>
            <button id="submit-credential" class="${styles["button-submit-cred"]}" disabled>SIGN UP</button>

            <div class="${styles["consent-container"]}">
                <label for="consent">Already have an account? <a href="/">Log In</a></label>
            </div>
        </div>
    `;

    root.className = styles["main"];
}