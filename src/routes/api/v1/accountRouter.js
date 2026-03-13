import { Router } from 'express';
import AccountController from '../../../controllers/v1/accountController.js';
import authorization from '../../../middlewares/authorization.js';
import authentication from '../../../middlewares/authentication.js';

const accountRouter = new Router();
const account = new AccountController();

accountRouter.use(authorization);

// Get Methods
accountRouter.get('/', authentication, account.getAccounttWithSpecificField.bind(account));
accountRouter.get('/all', authentication, account.getAll.bind(account));
accountRouter.get('/export', authentication, account.getExport.bind(account));

// Post Methods
accountRouter.post('/', authentication, account.create.bind(account));
accountRouter.post('/login', account.login.bind(account));

// Patch Methods
accountRouter.patch('/', authentication, account.updateAccountData.bind(account));

// Delete Methods
accountRouter.delete('/', authentication, account.deleteAccountData.bind(account));

export default accountRouter;