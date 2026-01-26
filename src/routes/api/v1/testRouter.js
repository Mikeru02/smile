import { Router } from "express";
import TestController from "../../../controllers/v1/testController.js";

const testRouter = new Router();
const test = new TestController();

testRouter.get('/', test.test.bind(test));

export default testRouter;