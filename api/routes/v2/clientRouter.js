import { Router } from 'express';
import ClientController from '../../controllers/v2/clientController.js';
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

const clientRouter = new Router();
const client = new ClientController();

clientRouter.use(authorization);

// Get Methods
clientRouter.get('/:type', authentication, client.getClientTime.bind(client));
clientRouter.get('/', authentication, client.getClientByIP.bind(client));

// Post Methods
clientRouter.post('/', client.create.bind(client));
clientRouter.post('/start', authentication, client.startDrop.bind(client));
clientRouter.post('/earn', authentication, client.earned.bind(client));
clientRouter.post('/authenticate', authentication, client.authenticate.bind(client));

// Patch Methods
clientRouter.patch('/', authentication, client.updateClientStatus.bind(client));

// Delete Methods

export default clientRouter;