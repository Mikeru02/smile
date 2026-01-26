import { Router } from 'express';
import clientRouter from './clientRouter.js';
import accountRouter from './accountRouter.js';
import arduinoRouter from './arduinoRouter.js';

export default function v1(arduino) {
    const v1 = new Router();

    v1.use('/client', clientRouter);
    v1.use('/account', accountRouter);
    v1.use('/arduino', arduinoRouter(arduino))
    return v1;
}
