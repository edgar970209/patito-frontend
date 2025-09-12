import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setOrders, updateOrderStatus } from '../store/slices/orderSlice';
import { addNotification } from '../store/slices/uiSlice';
import { orderService } from '../services/orderService';




// Hook para obtener órdenes con react-query y manejar estado global con Redux
export const useOrders = (filters = {}) => {

    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['orders', filters],
        queryFn: async () => orderService.listOrders(filters),
        onSuccess: (data) => {
            dispatch(setOrders(data));
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error fetching orders' }));
        }
    });
}


// Hook para obtener un pedido en especifico
export const useOrder = (id) => {

    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => orderService.getOrderById(id),
        enabled: !!id, // Solo ejecutar si id está definido
        onError: (error) => {
            console.error('Error al cargar pedido:', error);
        }
    });
}


// Hook para obtener pedido por estatus
export const useOrdersByStatus = (estatus) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['orders', 'status', estatus],
        queryFn: async () => orderService.getOrdersByStatus(estatus),
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error fetching orders by status' }));
        },
        enabled: !!estatus // Solo ejecutar si estatus está definido
    });
}


// Hook para obtener pedido por tienda
export const useOrdersByStore = (storeId) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['orders', 'store', storeId],
        queryFn: async () => orderService.getOrdersByStore(storeId),
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error fetching orders by store' }));
        },
        enabled: !!storeId // Solo ejecutar si storeId está definido
    });
}

// Hook para crear un nuevo pedido
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['orders']);
            dispatch(addNotification({ type: 'success', message: `Pedido #${data.id} creado exitosamente` }));
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error creating order' }));
        }
    })
}

// Hook para actualizar un pedido
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({ hawaId, statusUpdate }) => orderService.updateOrderStatus(hawaId, statusUpdate),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['orders']);
            queryClient.invalidateQueries(['order', variables.id]);
            dispatch(updateOrderStatus({
                id: variables.id,
                estatus: variables.statusUpdate.estatus || variables.statusUpdate.status
            }));
            dispatch(addNotification({
                type: 'success',
                message: `Estatus del pedido actualizado exitosamente`
            }));
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.response?.data?.message || 'Error updating order status' }));
        }
    });
}

// Hook para estadísticas de pedidos
export const useOrdersStats = () => {
    return useQuery({
        queryKey: ['orders', 'stats'],
        queryFn: async () => {
            // Si no tienes un endpoint específico para estadísticas,
            // obtenemos todos los pedidos y calculamos localmente
            const orders = await orderService.getAll();
            
            return {
                total: orders.length,
                pendientes: orders.filter(o => o.estatus === 'pendiente').length,
                entregados: orders.filter(o => o.estatus === 'entregado').length,
                cancelados: orders.filter(o => o.estatus === 'cancelado').length,
                totalValue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        onError: (error) => {
            console.error('Error al cargar estadísticas:', error);
        }
    });
};