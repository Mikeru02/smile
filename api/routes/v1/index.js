import { Router } from 'express';
// import { connectDB } from "../../core/database.js";
import { connectDB } from '../../core/neDB.js';

import Client from '../../models/v1/client.js';
import ClientController from '../../controllers/v1/clientController.js';
import clientRouter from "./client.js";

const v1 = new Router();

// Connect to db
const db = await connectDB();

// Create models
const clientModel = new Client(db);

// Create controllers
const clientController = new ClientController(clientModel);

// NOTE: Implement route modules here!
v1.use('/client', clientRouter(clientController));

export default v1;