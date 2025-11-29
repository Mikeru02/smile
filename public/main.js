import SPA from './core/spa';
// TODO: Import the pages here
import PageNotFound from './pages/pageNotFound';
import CaptivePortal from './pages/captivePortal';
import AdminLogin from './pages/admin/login';
import AdminHome from './pages/admin/home';
import AdminAnalytics from './pages/admin/analytics';
import AdminLogs from './pages/admin/logs';
import AdminAccountManagement from './pages/admin/accountManagement';
import Portal from './pages/receive';

import './styles/styles.css';

const app = new SPA({
    root: document.getElementById("app"),
    defaultRoute: PageNotFound
});

window.app = app;

// TODO: Add the routes here
app.add("/", CaptivePortal);
app.add("/admin/login", AdminLogin);
app.add("/admin/dashboard", AdminHome);
app.add("/admin/analytics", AdminAnalytics);
app.add("/admin/logs", AdminLogs);
app.add("/admin/account-management", AdminAccountManagement);
//app.add("/received", Portal);

app.handleRouteChanges();