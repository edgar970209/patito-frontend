
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../hooks/userAuth';
import {LoadingSpinner} from './LoadingSpinner';
import { Layout } from '../layout/Layout';

const ProtectedRoute = ({ requiredPermission = null, requiredRole = null }) => {
    const { isAuthenticated, user, isLoading } = useAuthState();
    const location = useLocation();

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return <LoadingSpinner message="Verificando autenticación..." />;
    }

    // Redirigir al login si no está autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verificar permisos si se requieren
    if (requiredPermission && user) {
        const hasPermission = user.permissions?.includes(requiredPermission) || user.role === 'admin';
        if (!hasPermission) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Verificar rol si se requiere
    if (requiredRole && user) {
        if (user.role !== requiredRole && user.role !== 'admin') {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Layout />
};

export default ProtectedRoute;