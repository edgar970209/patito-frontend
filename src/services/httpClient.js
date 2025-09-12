import { apiClient } from './apiService';



export const auditService = {
    // Crear registro de audiotoria 
    createAuditRecord: async (auditData) => {
        const response = await apiClient.post(`/audit/log`, auditData);
        return response.data;
    },

    // Obtener registros de auditoria
    getAuditRecords: async () => {
        const response = await apiClient.get(`/audit`);
        return response.data;
    },

    // Obtener registros por entidad y ID
    getAuditRecordsByUser: async (entityType, entityId) => {
        const response = await apiClient.get(`/audit/entity/${entityType}/${entityId}`);
        return response.data;
    },


    // Obtener registros por fechas en estadisticas
    getAuditStats: async (fechaInicial, fechaFinal) => {
        const response = await apiClient.get(`/audit/stats`, {
            params: { fechaInicial, fechaFinal }
        });
        return response.data;
    },


    // Obtener registros recientes
    getRecentAuditRecords: async (limit = 10) => {
        const response = await apiClient.get(`/audit/recent`, {
            params: { limit }
        });
        return response.data;
    },


    // Crear reporte de auditoria por pedido
    generateOrderAuditReport: async (paramsData) => {
        const response = await apiClient.post(`/audit/order`, paramsData);
        return response.data;
    },


    // Crear reporte de auditoria por producto
    generateProductAuditReport: async (paramsData) => {
        const response = await apiClient.post(`/audit/inventory`, paramsData);
        return response.data;
    },


    // Crear reporte de auditoria por usuario
    generateUserAuditReport: async (paramsData, token) => {
        const response = await apiClient.post(`/audit/user`, {
            params: paramsData,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },


    // Eliminar registros antiguos
    deleteOldAuditRecords: async (beforeDate) => {
        const response = await apiClient.delete(`/audit/cleanup`, {
            params: { beforeDate }
        });
        return response.data;
    },
}
