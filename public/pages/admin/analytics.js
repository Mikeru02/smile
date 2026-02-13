import SidebarLayout from "../../layouts/sidebar";
import Sidebar from "../../components/admin/sidebar";
import AdminEvents from "../../components/admin/events";
import PageEvents from "../../components/admin/analytics/events";
import MainCard from "../../components/admin/main";
import MainContent from "../../components/admin/analytics/main";

// export default function AdminAnalytics() {
//     const { header, main, footer } = Layout(this.root);

//     Header(header);
//     Main(main);
    
//     Events();
// }

export default class AdminAnalytics {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { sidebar, main } = SidebarLayout(this.root);

        Sidebar(sidebar);
        const card = MainCard(main, "Analytics");
        MainContent(card);
        
        AdminEvents();
        PageEvents();

    }
}