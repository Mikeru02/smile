import { Router } from 'express';
import AdminController from '../../../controllers/v1/adminController';
import authentication from '../../../middlewares/authentication';
import authorization from '../../../middlewares/authorization';

const adminRouter = new Router();
const admin = new AdminController();

adminRouter.use(authorization);

// Get Methods

// Post Methods
adminRouter.post('/', admin.createAccount.bind(admin));
adminRouter.post('/login', admin.login)
// Update Methods

// Delete Methods


export default adminRouter;