import styles from "./component.module.css";

export default function AdminRoutingEvent(){
    const navItems = document.querySelectorAll(`.${styles["nav-item"]}`);
    
    // Function to set active link based on current path
    function setActiveLink() {
        const currentPath = window.location.pathname;
        navItems.forEach(item => {
            if (item.dataset.value === currentPath) {
                item.classList.add(styles["active"]);
            } else {
                item.classList.remove(styles["active"]);
            }
        });
    }
    
    setActiveLink();
    
    window.addEventListener('popstate', setActiveLink);
    
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const route = item.getAttribute("data-value");
            if (route) {
                navItems.forEach(navItem => {
                    navItem.classList.remove(styles["active"]);
                });
                item.classList.add(styles["active"]);
                
                window.app.pushRoute(route);
            }
        })
    })
}
