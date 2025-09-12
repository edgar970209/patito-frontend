import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import { updateFilters } from '../store/slices/uiSlice';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Eye, Filter, Package, Plus, Search, XCircle } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { OrderStatusModal } from '../components/orders/OrderStatusModal';


export const OrderListPage = () => {

    const dispatch = useDispatch();
    const filters = useSelector((state) => state.ui.filters);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [orderSelected, setOrderSelected] = useState();
    const [showModalEstatus, setShowModalEstatus] = useState(false);

    const { data: orders = [], isLoading, error } = useOrders(filters);
    
    
    const updateStatusMutation = useUpdateOrderStatus();

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
        <div className="text-center py-12">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">Error al cargar los pedidos</p>
        </div>
        );
    }

    // Filtrar pedidos por término de búsqueda
    const filteredOrders = orders.content.filter(order => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            order.id.toString().includes(searchLower) ||
            order.customer?.nombre?.toLowerCase().includes(searchLower) ||
            order.vendedor?.toLowerCase().includes(searchLower) ||
            order.tienda?.toLowerCase().includes(searchLower)
        );
    });

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateStatusMutation.mutateAsync({ id: orderId, estatus: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleFilterChange = (filterName, value) => {
        dispatch(updateFilters({ [filterName]: value }));
    };

    const canCancelOrder = (order) => {
        if (order.estatus !== 'pendiente') return false;
        const createdAt = new Date(order.fechaCreacion);
        const now = new Date();
        const diffInMinutes = (now - createdAt) / (1000 * 60);
        return diffInMinutes <= 10;
    };

    // const getStatusIcon = (status) => {
    //     switch (status) {
    //     case 'pendiente':
    //         return <Clock className="w-4 h-4" />;
    //     case 'entregado':
    //         return <CheckCircle className="w-4 h-4" />;
    //     case 'cancelado':
    //         return <XCircle className="w-4 h-4" />;
    //     default:
    //         return <Package className="w-4 h-4" />;
    //     }
    // };

    const handleStatausChange = (order) => {
        setOrderSelected(order);
        setShowModalEstatus(true);
    }
    


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lista de Pedidos</h1>
                    <p className="text-gray-600 mt-1">
                        Gestiona y revisa todos los pedidos de camionetas
                    </p>
                </div>
                <Link
                    to="/pedidos/nuevo"
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Pedido
                </Link>
            </div>

            {/* Búsqueda y filtros */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                    {/* Búsqueda */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, cliente, vendedor..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                        Filtros
                        </button>

                        <select
                            value={filters.estatus}
                            onChange={(e) => handleFilterChange('estatus', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>

                {/* Filtros expandidos */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha inicio
                            </label>
                            <input
                                type="date"
                                value={filters.fechaInicio || ''}
                                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha fin
                            </label>
                            <input
                                type="date"
                                value={filters.fechaFin || ''}
                                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => dispatch(updateFilters({ fechaInicio: null, fechaFin: null, estatus: 'todos' }))}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: orders.content.length, color: 'bg-blue-500' },
                    { 
                        label: 'Pendientes', 
                        value: orders.content.filter(o => o.status.toLowerCase() === 'pendiente').length, 
                        color: 'bg-yellow-500' 
                    },
                    { 
                        label: 'Entregados', 
                        value: orders.content.filter(o => o.status.toLowerCase() === 'entregado').length, 
                        color: 'bg-green-500' 
                    },
                    { 
                        label: 'Cancelados', 
                        value: orders.content.filter(o => o.status.toLowerCase() === 'cancelado').length, 
                        color: 'bg-red-500' 
                    }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                ))}
            </div>

            {/* Lista de pedidos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                            {orders.length === 0 ? 'No hay pedidos registrados' : 'No se encontraron pedidos con los filtros aplicados'}
                        </p>
                        {orders.length === 0 && (
                            <Link
                                to="/pedidos/nuevo"
                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear primer pedido
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pedido
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vendedor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Package className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.customerName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.customerEmail}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.sellerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                                                {new Date(order.createdAt).toLocaleDateString('es-MX')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="cursor-pointer" onClick={ () => handleStatausChange(order)}>
                                                <StatusBadge status={order.status} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link
                                                to={`/pedidos/${order.id}`}
                                                className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Ver
                                            </Link>
                                            
                                            {order.status === 'pendiente' && (
                                                <div className="inline-flex space-x-1">
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'entregado')}
                                                        disabled={updateStatusMutation.isLoading}
                                                        className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Entregar
                                                    </button>
                                                    
                                                    {canCancelOrder(order) && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, 'cancelado')}
                                                            disabled={updateStatusMutation.isLoading}
                                                            className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Cancelar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Información sobre cancelaciones */}
            {filteredOrders.some(order => order.status === 'pendiente') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                        <strong>Nota:</strong> Los pedidos solo pueden cancelarse dentro de los primeros 10 minutos después de su creación.
                    </p>
                </div>
            )}


            {
                showModalEstatus && orderSelected && (
                    <OrderStatusModal 
                        order={ orderSelected }
                        isOpen={showModalEstatus}
                        onClose={() => setShowModalEstatus(false)}
                        onSubmit={ updateStatusMutation.mutateAsync }
                        isLoading={ updateStatusMutation.isLoading }
                    
                    />
                )
            }
        </div>
    );
}