import Layout from "../../layouts/default";
import Header from "../../components/admin/header";
import MainCard from "../../components/admin/main";
import MainContent from "../../components/admin/home/main";
import AdminEvents from "../../components/admin/events";

export default class AdminHome {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { header, main, footer } = Layout(this.root);

        Header(header);
        const card = MainCard(main, "Dashboard");
        MainContent(card)
        
        AdminEvents();
    }
}