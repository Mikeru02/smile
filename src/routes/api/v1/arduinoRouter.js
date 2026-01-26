import { Router } from "express";
import ArduinoController from "../../../controllers/v1/arduinoController.js";

export default function aduinoRouter(ino) {
    const arduinoRouter = new Router();
    const arduino = new ArduinoController(ino);

    
    return arduinoRouter;
}