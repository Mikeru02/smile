import SidebarLayout from "../../layouts/sidebar";
import Sidebar from "../../components/admin/sidebar";
import MainCard from "../../components/admin/main";
import MainContent from "../../components/admin/clients/main";
import AdminEvents from "../../components/admin/events";
import AdminRoutingEvent from "../../components/admin/routingEvent";

export default class AdminClients {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { sidebar, main } = SidebarLayout(this.root);

        Sidebar(sidebar);
        const card = MainCard(main, "Client Management");
        MainContent(card)
        
        AdminRoutingEvent();
        AdminEvents();
    }
}