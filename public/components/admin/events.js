import styles from "./component.module.css";

export default function AdminEvents(){
    document.title = "S.M.I.L.E - Admin";

    const navItems = document.querySelectorAll(`.${styles["nav-item"]}`);
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const route = item.getAttribute("data-value");
            window.app.pushRoute(route);
        })
    })
}