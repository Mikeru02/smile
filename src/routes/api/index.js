import { Router } from 'express';
import v1 from './v1/index.js';
import { getIO } from '../../utils/io.js';

export default function apiRouter({arduino}) {
    const apiRouter = new Router();
    const io = getIO();
    apiRouter.use('/v1', v1(arduino, io));
    return apiRouter;
}
