import { Router } from "express";
import SettingController from "../../../controllers/v1/settingController.js";
import authorization from "../../../middlewares/authorization.js";
import authentication from "../../../middlewares/authentication.js";

const settingRouter = new Router();
const setting = new SettingController();

settingRouter.use(authorization);

// Get Methods
settingRouter.get('/', authentication, setting.get.bind(setting));

// Patch Methods
settingRouter.patch('/', authentication, setting.update.bind(setting));

export default settingRouter;