import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default async function checkToken(token) {
    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SRC_KEY,
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
                `client/?field=username&value=${decoded.username}`,
                {
                    headers: {
                        "token": token
                    }
                }
            )

            console.log("RESPONSE", response)

            const clientData = response.data.data[0];

            if (!clientData || clientData.length === 0) {
                localStorage.removeItem('token');
                return false;
            }

            return true;
        } catch (error) {
            console.error("ERROR: ", error)
            localStorage.removeItem('token');
            return false;
        }
    }
}