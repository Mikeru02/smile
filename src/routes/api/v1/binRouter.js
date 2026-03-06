import { Router } from "express";
import BinController from "../../../controllers/v1/binController.js";
import authorization from "../../../middlewares/authorization.js";
import authentication from "../../../middlewares/authentication.js";

const binRouter = new Router();
const bin = new BinController();

binRouter.use(authorization);

// Get Methods
binRouter.get('/all-bin', authentication, bin.getAllBinTransaction.bind(bin));
binRouter.get('/bin/:bin', authentication, bin.getSpecificBinTransaction(bin));

// Post Methods
binRouter.post('/create', authentication, bin.createBin.bind(bin));
binRouter.post('/transac', authentication, bin.createBinTransaction.bind(bin));
// Patch Methods

// Delete Methods

export default binRouter;