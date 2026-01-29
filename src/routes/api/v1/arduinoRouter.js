import { Router } from "express";
import ArduinoController from "../../../controllers/v1/arduinoController.js";

export default function aduinoRouter(ino) {
    const arduinoRoute = new Router();
    const arduino = new ArduinoController(ino);

    arduinoRoute.get("/receive", arduino.receiveMess.bind(arduino));

    
    return arduinoRoute;
}