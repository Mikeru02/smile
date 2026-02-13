import { Router } from 'express';
import clientRouter from './clientRouter.js';
import adminRouter from './adminRouter.js';
import accountRouter from './accountRouter.js';
import arduinoRouter from './arduinoRouter.js';
import testRouter from './testRouter.js';

export default function v1(arduino, io) {
    const v1 = new Router();

    v1.use('/client', clientRouter);
    v1.use('/admin', adminRouter);
    v1.use('/account', accountRouter);
    v1.use('/arduino', arduinoRouter(arduino));
    v1.use('/test', testRouter(arduino, io));
    return v1;
}
