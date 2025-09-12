import { apiClient } from './apiService';


export const orderService = {
    // Crear orden
    createOrder: async (orderData) => {
        const response = await apiClient.post(`/orders`, orderData);
        return response.data;
    },


    // Obtener orden por ID
    getOrderById: async (orderId) => {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data;
    },

    // Listar todos los ordenes
    listOrders: async () => {
        const response = await apiClient.get(`/orders`);
        return response.data;
    },

    // Obtener orden por status
    getOrdersByStatus: async (status) => {
        const response = await apiClient.get(`/orders/status/${status}`);
        return response.data;
    },

    // Actualizar orden por ID basado en status
    updateOrderStatus: async (orderId, statusUpdate) => {
        const response = await apiClient.put(`/orders/${orderId}/status`, statusUpdate);
        return response.data;
    },


    // Obtener ordenes por tienda
    getOrdersByStore: async (storeId) => {
        const response = await apiClient.get(`/orders/store/${storeId}`);
        return response.data;
    }
}
