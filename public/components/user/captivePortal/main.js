import Logo from '/icons/logo.svg';
import styles from './component.module.css';

export default function Main(root){
    root.innerHTML = `
        <div class="${styles["card"]}">
            <img src=${Logo} class="${styles["logo"]}">
            <h1 class="${styles["title"]}">S.M.I.L.E</h1>
            <p class="${styles["desc"]}">Input Credentials</p>
            <div class="${styles["input-fields"]}">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" placeholder="Name">
                <label for="course">Course / Strand</label>
                <input type="text" name="course" id="course" placeholder="Course/Strand">
                <label for="yearlvl">Year Level</label>
                <input type="text" name="yearlvl" id="yearlvl" placeholder="Year Level">
            </div>
            <button id="submit-credential" class="${styles["button-submit-cred"]}">SUBMIT</button>
        </div>
    `;

    root.className = styles["main"];
}