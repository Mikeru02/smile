import SidebarLayout from "../../layouts/sidebar";
import Sidebar from "../../components/admin/sidebar";
import MainCard from "../../components/admin/main";
import AdminEvents from "../../components/admin/events";
import PageEvents from "../../components/admin/logs/event";
import MainContent from "../../components/admin/logs/main";
import AdminRoutingEvent from "../../components/admin/routingEvent";

export default class AdminLogs {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { sidebar, main } = SidebarLayout(this.root);

        Sidebar(sidebar);
        const card = MainCard(main, "Logs");
        MainContent(card)

        const stopProcess = AdminEvents();
        if (!stopProcess) {
            AdminRoutingEvent();
            PageEvents();
        }
    }
}