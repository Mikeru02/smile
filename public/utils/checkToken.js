import { jwtDecode } from 'jwt-decode';

export default function checkToken(token) {
    if (!token) {
        window.app.pushRoute = '/';
    } else {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp < currentTime) {
                localStorage.removeItem('token');
                window.app.pushRoute = '/';
            } else {
                window.app.pushRoute = '/portal';
            }
        } catch (error) {
            localStorage.removeItem('token');
            window.app.pushRoute = '/';
        }
    }
}