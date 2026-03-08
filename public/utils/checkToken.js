import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default async function checkToken(token) {
    const axiosClient = axios.create({
        baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SRC_KEY,
        }
    })

    if (!token) {
        return false;
    } else {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp < currentTime) {
                localStorage.removeItem('token');
                return false;
            }

            const response = await axiosClient.get(
                `client/?field=mac&value=${decoded.mac}`,
                {
                    headers: {
                        "token": token
                    }
                }
            )

            const clientData = response.data.data[0];

            console.log("cHECK TOKEN CLIENT DATA: ", clientData);

            if (!clientData) {
                // No client found
                localStorage.removeItem('token');
                return false;
            }

            return true;
        } catch (error) {
            localStorage.removeItem('token');
            return false;
        }
    }
}