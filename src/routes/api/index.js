import { Router } from 'express';
import v1 from '../v1';

const apiRouter = new Router();

apiRouter.use('/v1', v1);

export default apiRouter;
