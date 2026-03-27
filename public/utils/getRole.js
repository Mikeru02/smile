import { jwtDecode } from "jwt-decode";

export function getRole(token) {
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch (err) {
        localStorage.removeItem('token');
        return null;
    }
}