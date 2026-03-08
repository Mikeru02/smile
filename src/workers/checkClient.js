import axios from "axios";
import jwt from "jsonwebtoken";
import ClientManagement from "../utils/clientManagement.js";
import { pingClient } from "../utils/pingClient.js";

export default async function checkClients() {
    const loopInterval = 5;
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SRC_KEY,
            'token': jwt.sign({ role: "admin"}, process.env.API_SECRET_KEY,{
                expiresIn: "1m"
            })
        }
    })

    const checkClientsLoop = async () => {
        try {
            console.log('Check Clients Worker starts');

            const response = await axiosClient.get(
                `client/?field=ip&value=not_null`,
            )

            console.log("RESPONSE: ", response);

            const clients = response.data.data;
            console.log("CLIENTS", clients);

            const checks = clients.map(async (client) => {
                const reachable = await pingClient(client.ip);

                if (!reachable) {
                    const consumedTime = Math.floor(
                        (new Date() - new Date(client.connection_start_at)) / 1000
                    )

                    const updatedTimeRemaining = Math.max(0, client.time_remaining - consumedTime);

                    ClientManagement.revokeClient(client.ip);

                    await axiosClient.patch(
                        `client/?field=mac&value=${client.mac}`,
                        { 
                            ip: null,
                            status: "pending",
                            expire_at: null,
                            time_remaining: updatedTimeRemaining,
                            connection_start_at: null,
                            updated_at: new Date()
                        },
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