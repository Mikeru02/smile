import { Router } from 'express';
import AdminController from '../../../controllers/v1/adminController.js';
import authentication from '../../../middlewares/authentication.js';
import authorization from '../../../middlewares/authorization.js';

const adminRouter = new Router();
const admin = new AdminController();

adminRouter.use(authorization);

// Get Methods
adminRouter.get('/dashboard-info', admin.getDashboardInfo.bind(admin));
adminRouter.get('/machine-info', admin.getMachineInfo.bind(admin));
adminRouter.get('/prohibited-links', authentication, admin.getProhibitedLinks.bind(admin));
adminRouter.get('/accounts', authentication, admin.getAllAccounts.bind(admin));

// Post Methods
adminRouter.post('/', authentication, admin.createAccount.bind(admin));
adminRouter.post('/login', admin.loginAccount.bind(admin));
adminRouter.post('/prohibited-links', authentication, admin.createProhibitedLinks.bind(admin));

// Update Methods

// Delete Methods
adminRouter.delete('/prohibited-links/:id', authentication, admin.deleteProhibitedLink.bind(admin));


export default adminRouter;