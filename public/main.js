import SPA from './core/spa';
// TODO: Import the pages here
import PageNotFound from './pages/pageNotFound';
import CaptivePortal from './pages/user/captivePortal';
import TimePortal from './pages/user/timePortal';
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import AdminMachine from './pages/admin/machine';
import AdminClients from './pages/admin/clients';
import AdminAnalytics from './pages/admin/analytics';
import AdminLogs from './pages/admin/logs';
import AdminSettings from './pages/admin/settings';
import AdminAccountManagement from './pages/admin/accountManagement';

import './styles/styles.css';

const app = new SPA({
    root: document.getElementById("app"),
    defaultRoute: PageNotFound
});

window.app = app;

// TODO: Add the routes here
app.add("/", CaptivePortal);
app.add("/generate_204", CaptivePortal);
app.add("/portal", TimePortal, true);
app.add("/admin/login", AdminLogin);
app.add("/admin/dashboard", AdminDashboard);
app.add("/admin/machine", AdminMachine);
app.add("/admin/clients", AdminClients);
app.add("/admin/analytics", AdminAnalytics);
app.add("/admin/logs", AdminLogs);
app.add("/admin/settings", AdminSettings);
app.add("/admin/account-management", AdminAccountManagement);

app.handleRouteChanges();
