import { jwtDecode } from 'jwt-decode';


export const checkUserId = () => {
    const userId = localStorage.getItem('ID');
    if (!userId) return false;
    try {
        return Boolean(userId);
    } catch (e) {
        console.error("userId error:", e);
        return false;
    }
};

export const getUserId = () => {
    return localStorage.getItem('ID') || null;
};

export const getRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        return jwtDecode(token).role;

    } catch (e) {
        console.error("Role decoding error:", e);
        return null;
    }
};