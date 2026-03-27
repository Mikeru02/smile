import SidebarLayout from "../../layouts/sidebar";
import Sidebar from "../../components/admin/sidebar";
import MainCard from "../../components/admin/main";
import MainContent from "../../components/admin/machine/main";
import Events from "../../components/admin/machine/event";
import AdminEvents from "../../components/admin/events";
import AdminRoutingEvent from "../../components/admin/routingEvent";

export default class AdminMachine {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { sidebar, main } = SidebarLayout(this.root);

        Sidebar(sidebar);
        const card = MainCard(main, "Machine Details");
        MainContent(card)
        const stopProcess = AdminEvents();
        if (!stopProcess) {
            AdminRoutingEvent();
            Events();
        }
    }
}
