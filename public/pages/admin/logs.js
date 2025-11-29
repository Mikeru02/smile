import Layout from "../../layouts/default";
import Header from "../../components/admin/header";
import MainCard from "../../components/admin/main";
import AdminEvents from "../../components/admin/events";

export default class AdminLogs {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { header, main, footer }= Layout(this.root);

        Header(header);
        const card = MainCard(main, "Logs");

        AdminEvents();
    }
}