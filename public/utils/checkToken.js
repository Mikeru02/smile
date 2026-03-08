import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default async function checkToken(token) {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            return false;
        }

        const axiosClient = axios.create({
            baseURL: `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/`,
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SRC_KEY,
                'token': token
            }
        });

        const response = await axiosClient.get(`client/?field=mac&value=${decoded.mac}`)
            .catch(err => {
                console.error("checkToken axios error:", err);
                return null;
            });

        if (!response || !response.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
            console.warn("No client data found for MAC", decoded.mac);
            localStorage.removeItem('token');
            return false;
        }

        const clientData = response.data.data[0];

        if (!clientData.ip || clientData.status !== 'active') {
            console.warn("Client is not active or has no IP", clientData);
            localStorage.removeItem('token');
            return false;
        }

        return true;
    } catch (err) {
        console.error("checkToken failed:", err);
        localStorage.removeItem('token');
        return false;
    }
}