import { Router } from 'express';
import ClientController from '../../../controllers/v1/clientController.js';
import authorization from '../../../middlewares/authorization.js';
import authentication from '../../../middlewares/authentication.js';

const clientRouter = new Router();
const client = new ClientController();

clientRouter.use(authorization);

// Get Methods
clientRouter.get('/check-internet', authentication, client.checkInternet.bind(client));
clientRouter.get('/all-clients', client.getAllClients.bind(client));
clientRouter.get('/outOfTime', client.getAllOutOfTimeClients.bind(client));
clientRouter.get('/status/:status', authentication, client.getAllClientByStatus.bind(client));
clientRouter.get('/time/:type', authentication, client.getClientTime.bind(client));
clientRouter.get('/', authentication, client.getClientByIP.bind(client));


// Post Methods
clientRouter.post('/', client.create.bind(client));
clientRouter.post('/start', authentication, client.startDrop.bind(client));
clientRouter.post('/earn', authentication, client.earned.bind(client));
clientRouter.post('/firstAuth', authentication, client.firstAuthenticate.bind(client));
clientRouter.post('/auth', authentication, client.authenticate.bind(client));
clientRouter.post('/deauth', authentication, client.deauthenticate.bind(client));
clientRouter.post('/add-time', authentication, client.addTime.bind(client));

// Patch Methods
clientRouter.patch('/', authentication, client.updateClientStatus.bind(client));
clientRouter.patch('/all', client.updateAllClientsTime.bind(client));
clientRouter.patch('/revoke', authentication, client.revoke.bind(client));

// Delete Methods

export default clientRouter;