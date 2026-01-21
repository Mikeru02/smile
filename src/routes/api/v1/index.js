import { Router } from 'express';
import clientRouter from './clientRouter.js';
import accountRouter from './accountRouter.js';

const v1 = new Router();

v1.use('/client', clientRouter);
v1.use('/account', accountRouter);

export default v1;