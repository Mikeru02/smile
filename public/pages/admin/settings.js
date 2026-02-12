import SidebarLayout from "../../layouts/sidebar";
import Sidebar from "../../components/admin/sidebar";
import MainCard from "../../components/admin/main";
import MainContent from "../../components/admin/settings/main";
import AdminEvents from "../../components/admin/events";
import AdminRoutingEvent from "../../components/admin/routingEvent";

export default class AdminSettings {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { sidebar, main } = SidebarLayout(this.root);

        Sidebar(sidebar);
        const card = MainCard(main, "Settings");
        MainContent(card)
        
        AdminRoutingEvent();
        AdminEvents();
    }
}