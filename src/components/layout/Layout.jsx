import { Link, Outlet, useLocation } from 'react-router';

import { FileText, Home, List, LogOut, Menu, Package, ShoppingCart, Truck, User, X } from 'lucide-react';
import { NotificationContainer } from '../common/NotificationContainer';
import { useLogout, usePermissions } from '../../hooks/userAuth';




export const Layout = () => {
    const location = useLocation();
    const logout = useLogout();
    const { canManageInventory, canViewAudit } = usePermissions();

    const navigationItems = [
        {
            path: '/',
            label: 'Inicio',
            icon: Home,
            show: true
        },
        {
            path: '/pedidos/nuevo',
            label: 'Nuevo Pedido',
            icon: ShoppingCart,
            show: true
        },
        {
            path: '/pedidos',
            label: 'Lista de Pedidos',
            icon: List,
            show: true
        },
        {
            path: '/inventario',
            label: 'Inventario',
            icon: Package,
            show: canManageInventory()
        },
        {
            path: '/auditoria',
            label: 'Auditoría',
            icon: FileText,
            show: canViewAudit()
        },
        {
            path: '/',
            label: 'Cerrar sesion',
            icon: LogOut,
            show: canViewAudit()
        }
    ];

    const handleLogout = () => {
        logout();
    };


    return (
        <div className="top-0 w-full border-b border-gray-200">
             {/* Header */}
            <header className="bg-white shadow-sm border-b sticky z-40 w-full">
                <div className="px-6 sm:px-10 lg:px-10">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo y título */}
                        <div className="flex items-center justify-start rtl:justify-end px-10">
                            <Truck className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Tiendas Patito
                                </h1>
                                <p className="text-xs text-gray-500 hidden sm:block">
                                    Sistema de Pedidos
                                </p>
                            </div>
                        </div>
                        
                        {/* Navegación desktop */}
                        <nav className="flex flex-1 items-center justify-between">
                            {navigationItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                
                                return (
                                    <div key={index}>
                                        {
                                            item.label === 'Cerrar sesion' ? (
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center p-2 text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                                                    title="Cerrar sesión"
                                                    key={item.path}
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'text-blue-600 bg-blue-50'
                                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4 mr-2" />
                                                    {item.label}
                                                </Link>
                                            )
                                        }
                                    </div>
                                    
                                );
                            })}
                        </nav>
                        
                    </div>
                </div>

                
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>

            <NotificationContainer />
        </div>
    )
}