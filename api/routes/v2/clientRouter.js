import { Router } from 'express';
import ClientController from '../../controllers/v2/clientController.js';
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

const clientRouter = new Router();
const client = new ClientController();

clientRouter.use(authorization);

// Get Methods

// Post Methods
clientRouter.post('/', client.create.bind(client));
clientRouter.post('/start', authentication, client.startDrop.bind(client));

// Patch Methods

// Delete Methods

export default clientRouter;