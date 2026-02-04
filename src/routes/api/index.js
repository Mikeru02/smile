import { Router } from 'express';
import v1 from './v1/index.js';

export default function apiRouter({arduino}) {
    const apiRouter = new Router();

    apiRouter.use('/v1', v1(arduino));
    return apiRouter;
}
