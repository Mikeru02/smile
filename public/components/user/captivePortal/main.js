import Logo from '/icons/logo.svg';
import styles from './component.module.css';

export default function Main(root){
    root.innerHTML = `
        <div class="${styles["card"]}">
            <img src="${Logo}" class="${styles["logo"]}">
            <h1 class="${styles["title"]}">S.M.I.L.E</h1>
            <p class="${styles["desc"]}">Input Credentials</p>
            <div class="${styles["input-fields"]}">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" placeholder="Name" autocomplete="off">
                <label for="course">Course / Strand</label>
                <select id="course" data-value="course" class="${styles['courses']}"></select>
                <label for="yearlvl">Year Level</label>
                <select id="yearlvl" data-value="yearlvl" class="${styles['courses']}"></select>
            </div>
            <div class="${styles["consent-container"]}">
                <input type="checkbox" id="consent" name="consent">
                <label for="consent">I agree to the <a href="/terms-and-conditions">Terms and Conditions</a></label>
            </div>
            <button id="submit-credential" class="${styles["button-submit-cred"]}" disabled>SUBMIT</button>
        </div>
    `;

    root.className = styles["main"];
}