import styles from "./component.module.css";

export default function AdminEvents(){
    document.body.style.backgroundColor = "#0C393C";
    document.title = "S.M.I.L.E - Admin";

    const navButtons = document.querySelectorAll(`.${styles["button"]}`);
    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const route = button.getAttribute("data-value");
            window.app.pushRoute(route);
        })
    })
}