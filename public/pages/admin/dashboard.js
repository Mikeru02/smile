import SidebarLayout from "../../layouts/sidebar";
import Sidebar from "../../components/admin/sidebar";
import MainCard from "../../components/admin/main";
import MainContent from "../../components/admin/dashboard/main";
import Events from "../../components/admin/dashboard/events";
import AdminRoutingEvent from "../../components/admin/routingEvent";
import AdminEvents from "../../components/admin/events";

export default class AdminDashboard {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { sidebar, main } = SidebarLayout(this.root);

        Sidebar(sidebar);
        const card = MainCard(main, "Dashboard");
        MainContent(card)

        Events();
        AdminRoutingEvent();
        AdminEvents();
    }
}