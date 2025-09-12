import { apiClient } from './apiService';


export const inventoryService = {
    
    // Crear producto
    createProduct: async (productData) => {
        const response = await apiClient.post(`/inventory`,productData);
        return response.data;
    },

    // Buscar producto por HAWA
    getByHawa: async (hawa) => {
        const response = await apiClient.get(`/inventory/${hawa}`);
        return response.data;
    },
    // Listar productos
    listProducts: async () => {
        const response = await apiClient.get(`/inventory`);
        return response.data;
    },

    // Buscar productos (para búsqueda general)
    search: async (query) => {
        const response = await apiClient.get(`/inventory/`, {
        params: { search: query }
        });
        return response.data;
    },
    // Checar si el producto existe por HAWAs
    getAvailability: async (hawasList) => {
        const response = await apiClient.post(`/inventory/check-availability`, {hawasList});
        return response.data;
    },

    // Actualizar por HAWA
    updateByHawa: async (updateData) => {
        
        const response = await apiClient.put(`/inventory/${updateData.hawa}`, updateData.updateData);
        return response.data;
    },

    // Eliminar por HAWA
    deleteByHawa: async (hawaId) => {
        const response = await apiClient.delete(`/inventory/${hawaId}`);
        return response.data;
    },

    // Incrementar stock
    incrementStock: async (stockUpdate) => {
        const response = await apiClient.post(`/inventory/increment`, stockUpdate);
        return response.data;
    },

    // Decrementar stock
    decrementStock: async (stockUpdate) => {
        const response = await apiClient.post(`/inventory/decrement`, stockUpdate);
        return response.data;
    },

    // Reversar decremento de stock
    reverseDecrement: async (stockUpdate) => {
        const response = await apiClient.post(`/inventory/reverse`, stockUpdate);
        return response.data;
    },
    
    // Liberar stock (por ejemplo, al cancelar una orden)
    releaseStock: async (stockRelease) => {
        const response = await apiClient.post(`/inventory/release`, stockRelease);
        return response.data;
    },


    //Obtener productos bajos en inventario
    getLowStockProducts: async () => {
        const response = await apiClient.get(`/inventory/low-stock`);
        return response.data;
    },

    //Obtener productos agotados
    getOutOfStockProducts: async () => {
        const response = await apiClient.get(`/inventory/out-of-stock`);
        return response.data;
    },

}