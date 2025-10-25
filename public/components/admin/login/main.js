import Logo from '/icons/logo.svg';
import styles from './component.module.css';

export default function Main(root) {
    root.innerHTML = `
        <div class="${styles["card"]}">
            <img src=${Logo} class="${styles["logo"]}">
            <h1 class="${styles["title"]}">S.M.I.L.E - Admin</h1>
            <p class="${styles["desc"]}">Log In</p>

            <div class="">
                <label for="username">Username</label>
                <input type="text" name="username" placeholder="Name">
                <label for="password">Password</label>
                <input type="password" name="password">
            </div>
            <button id="submit-login" class="">Log In</button>
        </div>
    `;

    root.className = styles["main"];
}