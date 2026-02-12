import styles from "./component.module.css";

export default function AdminRoutingEvent(){
    const navItems = document.querySelectorAll(`.${styles["nav-item"]}`);
    console.log(navItems)
    
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
    
    // Set active link on initial load
    setActiveLink();
    
    // Listen for browser's back/forward buttons
    window.addEventListener('popstate', setActiveLink);
    
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const route = item.getAttribute("data-value");
            if (route) {
                // Update active state immediately for better UX
                navItems.forEach(navItem => {
                    navItem.classList.remove(styles["active"]);
                });
                item.classList.add(styles["active"]);
                
                // Navigate to the route
                window.app.pushRoute(route);
            }
        })
    })
}
