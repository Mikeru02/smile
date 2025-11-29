import HeaderMainOnly from "../../layouts/headerMain";
import Header from "../../components/admin/header";
import MainCard from "../../components/admin/main";
import AdminEvents from "../../components/admin/events";
import MainContent from "../../components/admin/logs/main";

export default class AdminLogs {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { header, main }= HeaderMainOnly(this.root);

        Header(header);
        const card = MainCard(main, "Logs");
        MainContent(card)

        AdminEvents();
    }
}