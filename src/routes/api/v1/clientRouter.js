import { Router } from 'express';
import ClientController from '../../../controllers/v1/clientController.js';
import authorization from '../../../middlewares/authorization.js';
import authentication from '../../../middlewares/authentication.js';

const clientRouter = new Router();
const client = new ClientController();

clientRouter.use(authorization);

// Get Methods
clientRouter.get('/', authentication, client.getClientWithSpecificField.bind(client));
clientRouter.get('/all', authentication, client.getAll.bind(client));

// Post Methods
clientRouter.post('/', client.create.bind(client));
clientRouter.post('/earn', authentication, client.earned.bind(client));

// Patch Methods
clientRouter.patch('/', authentication, client.updateClientData.bind(client));
clientRouter.patch('/add-time', authentication, client.addTime.bind(client));

// Delete Methods
clientRouter.delete('/', authentication, client.deleteClientData.bind(client));

export default clientRouter;