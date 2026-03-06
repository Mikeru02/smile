import { Router } from "express";
import LinkController from "../../../controllers/v1/linkController.js";
import authorization from "../../../middlewares/authorization.js";
import authentication from "../../../middlewares/authentication.js";

const linkRouter = new Router();
const link = new LinkController();

linkRouter.use(authorization);

// Get Methods
linkRouter.get('/prohibited/all', authentication, link.getAllProhibitedLinks.bind(link));

// Post Methods
linkRouter.post('/prohibited', authentication, link.createProhibitedLink.bind(link));

// Patch Methods

// Delete Methods
linkRouter.delete('/prohibited/:id', authentication, link.deleteProhibitedLink.bind(link));

export default linkRouter;