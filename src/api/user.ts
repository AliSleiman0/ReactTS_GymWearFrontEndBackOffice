import api from './api';

// Define User DTO interfaces
export const login = async (username: string, password: string): Promise<any> => {
    const url = '/auth/login';
    try {
        // Use POST and send credentials in an object
        const response = await api.post(url, { username, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};