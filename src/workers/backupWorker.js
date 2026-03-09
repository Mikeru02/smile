import axios from "axios";
import jwt from "jsonwebtoken";

export default async function backupWorker() {
    const loopInterval = 60;
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SRC_KEY,
        }
    })

    const backupLoop = async () => {
        try {
            const settingsResponse = await axiosClient.get(
                `setting/`,
                {
                    headers: {
                        'token': jwt.sign({ role: "admin"}, process.env.API_SECRET_KEY,{
                            expiresIn: "1m"
                        })
                    }
                }
            )

            const settings = settingsResponse.data.data[0];
            console.log("DEBUG SETTING ", settings);
        }
        catch (err) {
            console.error("Backup Worker Error: ", err);
        } finally {
            setTimeout(backupLoop, loopInterval * 1000);
        }
    }

    setTimeout(backupLoop, loopInterval * 1000);
}