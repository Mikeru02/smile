import { Router } from "express";
import ArduinoController from "../../../controllers/v1/arduinoController.js";

export default function aduinoRouter(ino) {
    const arduinoRoute = new Router();
    const arduino = new ArduinoController(ino);
    
    arduinoRoute.post('/capture', arduino.capture.bind(arduino));

    
    return arduinoRoute;
}