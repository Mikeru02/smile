import axios from 'axios';
import { Router } from 'express';
import ClientManagement from '../../utils/clientManagement.js';

const clientRouter = new Router();

clientRouter.post('/connect', async (req, res) => {
    await axios.post(
        `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_ROUTE_VERSION}/client/auth`, 
        {}, 
        {
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.API_KEY,
                'token': req.body.token
            }
        }
    );

    ClientManagement.allowClient(req.ip)
    return res.status(200).json({
        success: true,
    })
});

clientRouter.post('/disconnect', async (req, res) => {
    await axios.post(
        `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_ROUTE_VERSION}/client/deauth`, 
        {}, 
        {
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.API_KEY,
                'token': req.body.token
            }
        }
    );

    ClientManagement.revokeClient(req.ip);
    return res.status(200).json({
        success: true,
    });
});

clientRouter.patch('/revoke', async (req, res) => {
    await axios.patch(
        `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_ROUTE_VERSION}/client/revoke`, 
        {}, 
        {
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.API_KEY,
                'token': req.body.token
            }
        }
    );

    ClientManagement.revokeClient(req.ip);
    return res.status(200).json({
        success: true,
    });
})

export default clientRouter;