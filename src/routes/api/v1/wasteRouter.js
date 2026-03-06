import { Route, Router } from "express";
import WasteController from "../../../controllers/v1/wasteController.js";
import authentication from "../../../middlewares/authentication.js";
import authorization from "../../../middlewares/authorization.js";

const wasteRouter = new Router();
const waste = new WasteController();

wasteRouter.use(authorization);

// Get Methods
wasteRouter.get('/all', authentication, waste.getAllWasteTransactionCount.bind(waste));
wasteRouter.get('/all/:type', authentication, waste.getAllSpecificWasteTransaction.bind(waste));

// Post Methods

// Patch Methods

// Delete Methods

export default wasteRouter;