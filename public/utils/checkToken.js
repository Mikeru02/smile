import { jwtDecode } from 'jwt-decode';

export default function checkToken(token) {
    if (!token) {
        return false;
    } else {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp < currentTime) {
                localStorage.removeItem('token');
                return false;
            } else {
                return true;
            }
        } catch (error) {
            localStorage.removeItem('token');
            return false;
        }
    }
}