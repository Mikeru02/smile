import axios from "axios";
import jwt from 'jsonwebtoken';
import { checkInternet } from "../utils/dashboardInformation.js";

export default function checkInternetWorker() {
    const loopInterval = 30;
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SRC_KEY
        }
    })
    const checkInternetLoop = async() => {
        try {
            console.log('Check Internet Worker starts')
            const hasInternet = checkInternet();

            if (!hasInternet) {
                const activeClientsResponse = await axiosClient.get(
                    `client/status/active`,
                );
                const activeClients = activeClientsResponse.data.data;

                for (const client of activeClients) {
                    await axiosClient.post(
                        `client/deauth`,
                        { clientId: client.id },
                        {
                            headers: {
                                'token': jwt.sign({ 'role': 'admin' }, process.env.API_SECRET_KEY, {
                                    expiresIn: '1m'
                                    }) 
                            }
                        }
                    )
                }
            }

        } catch (err) {
            console.error('Check Internet Worker Error: ', err);
        } finally {
            setTimeout(checkInternetLoop, loopInterval * 1000);
        }
    }
    setTimeout(checkInternetLoop, loopInterval * 1000);
}