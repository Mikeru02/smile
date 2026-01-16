import { Router } from 'express';
import ClientManagement from '../../utils/clientManagement.js';

const clientRouter = new Router();

clientRouter.post('/connect', async (req, res) => {
    return res.status(200).json({
        success: true,
    })
})

export default clientRouter;