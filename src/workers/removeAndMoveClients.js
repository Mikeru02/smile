import axios from "axios";
import jwt from 'jsonwebtoken';

export default async function removeAndMoveClients() {
    const loopInterval = 60;
    const removeAndMoveLoop = async () => {
        try {
            console.log('Remove and Move Worker starts')
            const response = await axios.get(
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
                console.log('IP:', client.ip)
                const response = await axios.patch(
                    `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/client/move`,
                    { ip: client.ip },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': process.env.SRC_KEY,
                        }
                    }
                )
            }
        }catch (err) {
            console.error('Remove and Move Error: ', err);
        } finally {
            setTimeout(removeAndMoveLoop, loopInterval * 1000);
        }
    }
    setTimeout(removeAndMoveLoop, loopInterval * 1000);
}