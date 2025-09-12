
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { auditService } from '../services/httpClient';
import { addNotification } from '../store/slices/uiSlice';

// Hook para obtener registros de auditoría
export const useAuditRecords = () => {
    return useQuery({
        queryKey: ['audit', 'records'],
        queryFn: auditService.getAuditRecords,
        onError: (error) => {
            console.error('Error al cargar registros de auditoría:', error);
        }
    });
};

// Hook para obtener registros recientes
export const useRecentAuditRecords = (limit = 10) => {
    return useQuery({
        queryKey: ['audit', 'recent', limit],
        queryFn: () => auditService.getRecentAuditRecords(limit),
        onError: (error) => {
            console.error('Error al cargar registros recientes:', error);
        }
    });
};

// Hook para obtener registros por entidad
export const useAuditRecordsByEntity = (entityType, entityId) => {
    return useQuery({
        queryKey: ['audit', 'entity', entityType, entityId],
        queryFn: () => auditService.getAuditRecordsByUser(entityType, entityId),
        enabled: !!entityType && !!entityId,
        onError: (error) => {
            console.error('Error al cargar registros por entidad:', error);
        }
    });
};

// Hook para obtener estadísticas de auditoría
export const useAuditStats = (fechaInicial, fechaFinal) => {
    return useQuery({
        queryKey: ['audit', 'stats', fechaInicial, fechaFinal],
        queryFn: () => auditService.getAuditStats(fechaInicial, fechaFinal),
        enabled: !!fechaInicial && !!fechaFinal,
        onError: (error) => {
            console.error('Error al cargar estadísticas de auditoría:', error);
        }
    });
};

// Hook para crear registro de auditoría
export const useCreateAuditRecord = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: auditService.createAuditRecord,
        onSuccess: () => {
            queryClient.invalidateQueries(['audit']);
            dispatch(addNotification({
                type: 'success',
                message: 'Registro de auditoría creado exitosamente'
            }));
        },
        onError: (error) => {
            dispatch(addNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al crear registro de auditoría'
            }));
        }
    });
};

// Hook para generar reporte de auditoría por pedido
export const useGenerateOrderAuditReport = () => {
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: auditService.generateOrderAuditReport,
        onSuccess: (data) => {
            dispatch(addNotification({
                type: 'success',
                message: 'Reporte de auditoría de pedido generado exitosamente'
            }));
            
            // Si el reporte viene como blob o URL, abrir en nueva ventana
            if (data.url) {
                window.open(data.url, '_blank');
            }
        },
        onError: (error) => {
            dispatch(addNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al generar reporte de auditoría'
            }));
        }
    });
};

// Hook para generar reporte de auditoría por producto
export const useGenerateProductAuditReport = () => {
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: auditService.generateProductAuditReport,
        onSuccess: (data) => {
            dispatch(addNotification({
                type: 'success',
                message: 'Reporte de auditoría de inventario generado exitosamente'
            }));
            
            if (data.url) {
                window.open(data.url, '_blank');
            }
        },
        onError: (error) => {
            dispatch(addNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al generar reporte de inventario'
            }));
        }
    });
};

// Hook para generar reporte de auditoría por usuario
export const useGenerateUserAuditReport = () => {
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: auditService.generateUserAuditReport,
        onSuccess: (data) => {
            dispatch(addNotification({
                type: 'success',
                message: 'Reporte de auditoría de usuario generado exitosamente'
            }));
            
            if (data.url) {
                window.open(data.url, '_blank');
            }
        },
        onError: (error) => {
            dispatch(addNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al generar reporte de usuario'
            }));
        }
    });
};

// Hook para eliminar registros antiguos
export const useDeleteOldAuditRecords = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: auditService.deleteOldAuditRecords,
        onSuccess: () => {
            queryClient.invalidateQueries(['audit']);
            dispatch(addNotification({
                type: 'success',
                message: 'Registros antiguos eliminados exitosamente'
            }));
        },
        onError: (error) => {
            dispatch(addNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar registros antiguos'
            }));
        }
    });
};