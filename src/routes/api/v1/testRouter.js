import { Router } from "express";
import TestController from "../../../controllers/v1/testController.js";

export default function testRouter(ino, io) {
    const testRouter = new Router();
    const test = new TestController(ino, io);

    testRouter.get('/', test.test.bind(test));
    testRouter.get("/capture", test.capture.bind(test))
    testRouter.post('/', test.sendMessage.bind(test));
    testRouter.post('/add', test.testAdd.bind(test));
    testRouter.post('/io', test.testIO.bind(test))
    return testRouter;
}
