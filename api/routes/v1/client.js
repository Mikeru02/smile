import { Router } from 'express';
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

export default function clientRouter(clientController) {
    const router = Router();

    router.use(authorization);

    // Post Methods
    router.post('/', clientController.create.bind(clientController));
    router.post('/start', authentication, clientController.startDrop.bind(clientController));
    router.post('/earn', authentication, clientController.earned.bind(clientController));
    router.post('/authenticate', authentication, clientController.authenticate.bind(clientController));

    // Patch Methods
    router.patch('/authenticate', clientController.authenticate.bind(clientController));

    return router;
}