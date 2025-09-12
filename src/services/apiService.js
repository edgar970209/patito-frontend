import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';



const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})


// Interceptor para agregar datos de auditoría
apiClient.interceptors.request.use(config => {
    // Agregar IP del usuario (en un entorno real se obtendría del backend)
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Agregar datos de auditoría
    config.headers['X-User-IP'] = '127.0.0.1'; // En producción obtener IP real
    config.headers['X-Timestamp'] = new Date().toISOString();
    
    return config;
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use((response) => 
    response,
    (error) => {
        if (error.response?.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        }
        console.error('Error en la API:', error);
        return Promise.reject(error);
    }
);


export { apiClient };