import SidebarLayout from "../../layouts/sidebar";
import Sidebar from "../../components/admin/sidebar";
import MainCard from "../../components/admin/main";
import AdminEvents from "../../components/admin/events";
import PageEvents from "../../components/admin/accountManagement/event";
import MainContent from "../../components/admin/accountManagement/main";

export default class AdminAccountManagement {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { sidebar, main } = SidebarLayout(this.root);

        Sidebar(sidebar);
        const card = MainCard(main, "Account Management");
        MainContent(card);

        AdminEvents();
        PageEvents();
    }
}