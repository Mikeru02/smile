import { Router } from 'express';
import clientRouter from './clientRouter.js';
import logRouter from './logsRouter.js';
import accountRouter from './accountRouter.js';
import wasteRouter from './wasteRouter.js';

export default function v1(arduino, io) {
    const v1 = new Router();

    v1.use('/client', clientRouter);
    v1.use('/logs', logRouter);
    v1.use('/account', accountRouter);
    v1.use('/waste', wasteRouter);
    return v1;
}
