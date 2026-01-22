import HeaderMainOnly from "../../layouts/headerMain";
import Header from "../../components/admin/header";
import MainCard from "../../components/admin/main";
import AdminEvents from "../../components/admin/events";
import PageEvents from "../../components/admin/accountManagement/event";
import MainContent from "../../components/admin/accountManagement/main";

export default class AdminAccountManagement {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { header, main } = HeaderMainOnly(this.root);

        Header(header);
        const card = MainCard(main, "Account Management");
        MainContent(card);

        AdminEvents();
        PageEvents();
    }
}