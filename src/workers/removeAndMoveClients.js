import axios from "axios";
import jwt from 'jsonwebtoken';

export default async function removeAndMoveClients() {
    const loopInterval = 60;
    const removeAndMoveLoop = async () => {
        try {
            const response = axios.get(
                `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/client/outOfTime`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': process.env.SRC_KEY
                    }
                }
            )

            const outOfTimeClients = response.data.data;

            for (const client of outOfTimeClients) {
                const response = await axios.patch(
                    `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/client/move`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': process.env.SRC_KEY,
                            'token': jwt.sign({ ip: client.ip }, process.env.API_SECRET_KEY, {
                                    expiresIn: '1m'
                                    })
                        }
                    }
                )
            }
        }catch (err) {
            console.error('Time Deductor Error: ', err);
        } finally {
            setTimeout(removeAndMoveLoop, loopInterval * 1000);
        }
    }
}