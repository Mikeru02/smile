import { Router } from "express";
import LogController from '../../../controllers/v1/logController.js';
import authentication from "../../../middlewares/authentication.js";
import authorization from "../../../middlewares/authorization.js";

const logRouter = new Router();
const log = new LogController();

logRouter.use(authorization);

// Get Methods
logRouter.get('/', authentication, log.get.bind(log));

// Post Methods


export default logRouter;