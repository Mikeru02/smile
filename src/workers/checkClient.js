import axios from "axios";
import jwt from "jsonwebtoken";
import ClientManagement from "../utils/clientManagement.js";
import { pingClient } from "../utils/pingClient.js";

export default async function checkClients() {
    const loopInterval = 30;
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SRC_KEY,
        }
    })

    const checkClientsLoop = async () => {
        try {
            console.log('Check Clients Worker starts');

            const response = await axiosClient.get(
                `client/?field=ip&value=not_null`,
                {
                    headers: {
                        'token': jwt.sign({ role: "admin"}, process.env.API_SECRET_KEY,{
                            expiresIn: "1m"
                        })
                    }
                }
            )

            const clients = response.data.data || [];

            const checks = clients.map(async (client) => {
                const reachable = await pingClient(client.ip);

                if (!reachable) {
                    const now = new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ");

                    let updatedTimeRemaining = client.time_remaining;

                    if (client.connection_start_at) {
                        const consumedTime = Math.floor(
                            (new Date() - new Date(client.connection_start_at)) / 1000
                        )

                        updatedTimeRemaining = Math.max(0, client.time_remaining - consumedTime);
                    }
                    ClientManagement.revokeClient(client.ip);

                    await axiosClient.patch(
                        `client/?field=id&value=${client.id}`,
                        { 
                            mac: null,
                            hostname: null,
                            ip: null,
                            is_logged: 0,
                            expire_at: null,
                            time_remaining: updatedTimeRemaining,
                            connection_start_at: null,
                            updated_at: now
                        },
                        {
                            headers: {
                                "token": jwt.sign({ role: "admin"}, process.env.API_SECRET_KEY,{
                                    expiresIn: "1m"
                                })
                            }
                        }
                    )
                }
            })
            await Promise.all(checks);
        }
        catch (err) {
            console.error('Check Client Worker Error: ', err);
        } 
        finally {
            setTimeout(checkClientsLoop, loopInterval * 1000);
        }
    }
    setTimeout(checkClientsLoop, loopInterval * 1000);
}