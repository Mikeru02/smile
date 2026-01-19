import { Router } from 'express';
import clientRouter from './clientRouter.js';

const v1 = new Router();

v1.use('/client', clientRouter);

export default v1;