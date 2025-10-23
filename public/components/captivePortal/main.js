import Logo from '/icons/logo.svg';
import styles from './component.module.css';

export default function Main(root){
    root.innerHTML = `
        <div class="${styles["card"]}">
            <img src=${Logo}>
            <h1>S.M.I.L.E</h1>
            <label for="name">Name</label>
            <input type="text" name="name" id="name" placeholder="Name">
            <label for="course">Course / Strand</label>
            <input type="text" name="course" id="course" placeholder="Course/Strand">
            <label for="yearlvl">Year Level</label>
            <input type="text" name="yearlvl" id="yearlvl" placeholder="Year Level"
        </div>
    `;

    root.className = styles["main"];
}