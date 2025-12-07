// Criado por Ítalo de Souza
import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, userId, name, role } = response.data;

        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ userId, name, email, role }));

        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token, userId, name, email, role } = response.data;

        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ userId, name, email, role }));

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;
