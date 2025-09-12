
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';

// Hook para login
export const useLogin = () => {
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: authService.login,
        onMutate: () => {
            dispatch(loginStart());
        },
        onSuccess: (data) => {

            dispatch(loginSuccess(data));
            dispatch(addNotification({
                type: 'success',
                message: 'Inicio de sesión exitoso'
            }));
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Error al iniciar sesión';
            dispatch(loginFailure(message));
            dispatch(addNotification({
                type: 'error',
                message
            }));
        }
    });
};

// Hook para registro
export const useRegister = () => {
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            dispatch(addNotification({
                type: 'success',
                message: 'Registro exitoso. Inicia sesión con tus credenciales.'
            }));
            return data;
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Error al registrarse';
            dispatch(addNotification({
                type: 'error',
                message
            }));
        }
    });
};

// Hook para logout
export const useLogout = () => {
    const dispatch = useDispatch();
    
    return () => {
        dispatch(logout());
        dispatch(addNotification({
            type: 'info',
            message: 'Sesión cerrada correctamente'
        }));
    };
};

// Hook para obtener el estado de autenticación
export const useAuthState = () => {
    return useSelector((state) => state.auth);
};

// Hook para verificar permisos
export const usePermissions = () => {
    const { user } = useSelector((state) => state.auth);
    
    const hasPermission = (permission) => {
        if (!user || !user.permissions) return false;

        return user.permissions.includes(permission);
    };
    
    const isAdmin = () => {
        return user?.role === 'admin';
    };
    
    const canManageOrders = () => {
        return hasPermission('manage_orders') || isAdmin();
    };
    
    const canManageInventory = () => {
        return hasPermission('manage_inventory') || isAdmin();
    };
    
    const canViewAudit = () => {
        return hasPermission('view_audit') || isAdmin();
    };
    
    return {
        hasPermission,
        isAdmin,
        canManageOrders,
        canManageInventory,
        canViewAudit
    };
};