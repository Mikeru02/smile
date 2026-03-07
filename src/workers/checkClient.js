import axios from "axios";
import jwt from "jsonwebtoken";
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

            const clients = response.data.data;

            const checks = clients.map(async (client) => {
                const reachable = await pingClient(client.ip);

                if (!reachable) {
                    await axiosClient.patch(
                        `client/?field=mac&value=${client.mac}`,
                        { ip: null },
                    )
                }
            })
            await Promise.all(checks);
        }
        catch (err) {
            console.error('Check Internet Worker Error: ', err);
        } 
        finally {
            setTimeout(checkClientsLoop, loopInterval * 1000);
        }
    }

    // const clients = await db.query(
    //     "SELECT mac, ip FROM clients WHERE ip IS NOT NULL"
    // );

    // const checks = clients.map(async (client) => {
    //     const reachable = await pingClient(client.ip);

    //     if (!reachable) {
    //         await db.query(
    //             "UPDATE clients SET ip = NULL WHERE mac = ?",
    //             [client.mac]
    //         );

    //         console.log(`${client.mac} disconnected`);
    //     }
    // });

    // await Promise.all(checks);
}