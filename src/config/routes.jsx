import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { Layout } from '../components/layout/Layout';
import { CreateOrderPage } from '../pages/CreateOrderPage';
import { OrderListPage } from '../pages/OrderListPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { InventoryPage } from '../pages/InventoryPage';
import { AuditPage } from '../pages/AuditPage';


export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path='/' element={<ProtectedRoute />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/pedidos/nuevo' element={<CreateOrderPage />} />
                <Route path='/pedidos' element={ <OrderListPage />} />
                <Route path='/pedidos/:id' element={<OrderDetailsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route 
                    path="/inventario" 
                    element={
                        <InventoryPage />
                    } 
                />
                <Route 
                    path="/auditoria" 
                    element={
                        <ProtectedRoute requiredPermission="view_audit">
                        <AuditPage />
                        </ProtectedRoute>
                    } 
                />
                {/* <Route path="/perfil" element={<ProfilePage />} /> */}
            </Route>
        </Route>
    )
)