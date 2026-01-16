import { jwtDecode } from 'jwt-decode';

export default function checkToken(token) {
    if (!token) {
        return '/';
    } else {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp < currentTime) {
                localStorage.removeItem('token');
                return '/';
            } else {
                return '/portal';
            }
        } catch (error) {
            localStorage.removeItem('token');
            return '/';
        }
    }
}