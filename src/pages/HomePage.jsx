import { Clock, List, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { Link } from 'react-router-dom';



export const HomePage = () => {

    const { data: orders = [] } = useOrders();
    
    // Estadísticas básicas
    const stats = {
        totalPedidos: orders.content?.length,
        pendientes: orders.content?.filter(order => order.status.toLowerCase() === 'pendiente').length,
        entregados: orders.content?.filter(order => order.status.toLowerCase() === 'entregado').length,
        cancelados: orders.content?.filter(order => order.status.toLowerCase() === 'cancelado').length
    };

    const quickActions = [
        {
            title: 'Crear Nuevo Pedido',
            description: 'Iniciar un nuevo pedido de camionetas',
            icon: ShoppingCart,
            path: '/pedidos/nuevo',
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            title: 'Ver Todos los Pedidos',
            description: 'Gestionar y revisar pedidos existentes',
            icon: List,
            path: '/pedidos',
            color: 'bg-green-500 hover:bg-green-600'
        }
    ];

    const statisticCards = [
        {
            title: 'Total Pedidos',
            value: stats.totalPedidos,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Pendientes',
            value: stats.pendientes,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            title: 'Entregados',
            value: stats.entregados,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Cancelados',
            value: stats.cancelados,
            icon: Users,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        }
    ];


    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Sistema de Pedidos - Tiendas Patito
                </h1>
                <p className="text-lg text-gray-600">
                    Gestiona el inventario y pedidos de camionetas de manera eficiente
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statisticCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                );
                })}
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <Link
                        key={index}
                        to={action.path}
                        className={`${action.color} text-white rounded-lg p-6 transition-colors duration-200 block group`}
                    >
                        <div className="flex items-center">
                            <Icon className="w-8 h-8 mr-4" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {action.title}
                                </h3>
                                <p className="text-blue-100 group-hover:text-white">
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                );
                })}
            </div>

            {/* Pedidos recientes */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Pedidos Recientes
                    </h2>
                </div>
                <div className="p-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">
                                No hay pedidos registrados aún
                            </p>
                            <Link
                                to="/pedidos/nuevo"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Crear primer pedido
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.content.slice(0, 5).map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">
                                    Pedido #{order.id}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                    Cliente: {order.customerName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                    Vendedor: {order.sellerName}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'pendiente' 
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : order.status === 'entregado'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {order.status}
                                    </span>
                                    <p className="text-sm text-gray-600 mt-1">
                                    ${order.totalAmount?.toLocaleString()}
                                    </p>
                                </div>
                                </div>
                            ))}
                            
                            {orders.content.length > 5 && (
                                <div className="text-center pt-4">
                                    <Link
                                        to="/pedidos"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Ver todos los pedidos →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}