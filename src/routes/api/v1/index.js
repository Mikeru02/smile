import { Router } from 'express';
import clientRouter from './clientRouter.js';
import logRouter from './logsRouter.js';
import accountRouter from './accountRouter.js';

export default function v1(arduino, io) {
    const v1 = new Router();

    v1.use('/client', clientRouter);
    v1.use('/logs', logRouter);
    v1.use('/account', accountRouter);
    return v1;
}
