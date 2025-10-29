import SPA from './core/spa';
// TODO: Import the pages here
import PageNotFound from './pages/pageNotFound';
import CaptivePortal from './pages/captivePortal';
import Admin from './pages/admin/login';
import Portal from './pages/receive';

import './styles/styles.css';

const app = new SPA({
    root: document.getElementById("app"),
    defaultRoute: PageNotFound
});

window.app = app;

// TODO: Add the routes here
app.add("/", CaptivePortal);
app.add("/admin", Admin);
app.add("/received", Portal);

app.handleRouteChanges();