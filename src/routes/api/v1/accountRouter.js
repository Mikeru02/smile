import { Router } from 'express';
import AccountController from '../../../controllers/v1/accountController.js';
import authorization from '../../../middlewares/authorization.js';
import authentication from '../../../middlewares/authentication.js';

const accountRouter = new Router();
const account = new AccountController();

accountRouter.use(authorization);

// Get Methods
accountRouter.get('/all', authentication, account.getAllAccounts.bind(account));

// Post Methods
accountRouter.post('/', account.create.bind(account));
accountRouter.post('/login', account.login.bind(account));

// Patch Methods

// Delete Methods

export default accountRouter;