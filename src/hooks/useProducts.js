import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { inventoryService } from '../services/productService';
import { addNotification } from '../store/slices/uiSlice';



// Hook para buscar productos por HAWA
export const useProduct = (hawa) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['product', hawa],
        queryFn: () => inventoryService.getByHawa(hawa),
        enabled: !!hawa,
        onError: (error) => {
            dispatch(addNotification({
                type: 'Error',
                message: error.response?.data?.message || 'Error al buscar el producto'
            }))
        }
    });
}


// Hook para crear el producto
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: inventoryService.createProduct,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['products']);
            dispatch(addNotification({ type: 'success', message: `Producto #${data.hawa} creado exitosamente` }));
            return data;
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error creating order' }));
        }
    })
}


//Hook para obtener todos los productos
export const useProducts = () => {

    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['products'],
        queryFn: inventoryService.listProducts,
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error fetching products' }));
        }
    });
}

// Hook para buscar productos por término
export const useProductSearch = (query) => {
    return useQuery({
        queryKey: ['products', 'search', query],
        queryFn: () => inventoryService.search(query),
        enabled: !!query && query.length >= 2,
        staleTime: 30000, // 30 segundos
        onError: (error) => {
            console.error('Error en búsqueda de productos:', error);
        }
    });
};

// Hook para valida si existe por HAWAs
export const useAvailability = () => {

    const dispatch = useDispatch();

    return useMutation({
        mutationFn: inventoryService.getAvailability,
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error fetching products' }));
        }
    });
}


// Hook para actualizar un producto
export const useUpdateProductStatus = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();


    return useMutation({
        mutationFn: inventoryService.updateByHawa,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['products']);
            queryClient.invalidateQueries(['product', variables.hawa]);
            dispatch(addNotification({ type: 'success', message: `Estatus del producto actualizado a ${variables.hawa}` }));

            return data;
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.response?.data?.message || 'Error updating Product' }));
        }
    });
}


// Hook para eliminar un producto
export const useDeleteByHawa = (  ) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: inventoryService.deleteByHawa,
        onSuccess: (data, variables) => {
            
            queryClient.invalidateQueries(['products']);
            queryClient.removeQueries(['product', variables]);
            dispatch(addNotification({ type: 'success', message: `Estatus del producto actualizado a ${variables.estatus}` }));
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.response?.data?.message || 'Error deleting Product' }));
        }
    })
}


// Hook para incrementar stock
export const useIncrementStock = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: inventoryService.incrementStock,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['products']);
            if (data.hawa) {
                queryClient.invalidateQueries(['product', data.hawa]);
            }
            dispatch(addNotification({ type: 'success', message: `Producto se a incrementado de stock ${data.id}` }));
            return data;
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.response?.data?.message || 'Error increment Product' }));
        },
    })
}

// Hook para deecrementar stock
export const useDecrementStock = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: inventoryService.decrementStock,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['products']);
            if (data.hawa) {
                queryClient.invalidateQueries(['product', data.hawa]);
            }
            dispatch(addNotification({ type: 'success', message: `Producto se a decrementado de stock ${data.id}` }));
            return data;
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.response?.data?.message || 'Error decrement Product' }));
        },
    })
}

// Hook para liberar stock
export const useReleaseStock = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: inventoryService.releaseStock,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['products']);
            dispatch(addNotification({ type: 'success', message: `Producto se a liberado del stock ${data.id}` }));
            return data;
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.response?.data?.message || 'Error release Product' }));
        },
    })
}

// Hook para Reversar stock
export const useReverseStock = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: inventoryService.reverseDecrement,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['products']);
            if (data.hawa) {
                queryClient.invalidateQueries(['product', data.hawa]);
            }
            dispatch(addNotification({ type: 'success', message: `Producto se a reversado del stock ${data.id}` }));
            return data;
        },
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.response?.data?.message || 'Error reversed Product' }));
        },
    })
}


// Hook para obtener productos bajos
export const useLowStack = () => {

    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['products', 'low-stock'],
        queryFn: inventoryService.getLowStockProducts,
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error fetching products' }));
        }
    });
}


// Hook para obtener productos agotados
export const useOutOfStock = () => {

    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['products', 'out-of-stock'],
        queryFn: inventoryService.getOutOfStockProducts,
        onError: (error) => {
            dispatch(addNotification({ type: 'error', message: error.message || 'Error fetching products' }));
        }
    });
}
