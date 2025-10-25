import SPA from './core/spa';
// TODO: Import the pages here
import PageNotFound from './pages/pageNotFound';
import CaptivePortal from './pages/captivePortal';
import Admin from './pages/admin/login';

import './styles/styles.css';

const app = new SPA({
    root: document.getElementById("app"),
    defaultRoute: PageNotFound
});

// TODO: Add the routes here
app.add("/", CaptivePortal);
app.add("/admin", Admin)

app.handleRouteChanges();