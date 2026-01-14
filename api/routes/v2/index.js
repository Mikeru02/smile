import { Router } from 'express';
import clientRouter from './clientRouter.js';

const v2 = new Router();

v2.use('/client', clientRouter);

export default v2;