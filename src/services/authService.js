import { apiClient } from './apiService';


export const authService = {

    // Login
    login: async (credentials) => {
        const response = await apiClient.post(`/auth/login`, credentials);
        return response.data;
    },

    // Registro
    register: async (userData) => {
        const response = await apiClient.post(`/auth/register`, userData);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
    
    // Verificar si el usuario está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
    
    // Obtener token
    getToken: () => {
        return localStorage.getItem('authToken');
    },
    
    // Obtener usuario
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}