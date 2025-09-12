import { useNavigate, useParams } from 'react-router-dom';
import { useOrder, useUpdateOrderStatus } from '../hooks/useOrders';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ArrowLeft, Calendar, CheckCircle, DollarSign, Mail, MapPin, Package, Phone, Store, User, XCircle } from 'lucide-react';



export const OrderDetailsPage = () => {

    const { id } = useParams();

    const navigate = useNavigate();
    const { data: order, isLoading, error } = useOrder(id);
    
    const updateStatusMutation = useUpdateOrderStatus();

    const handleStatusChange = async (newStatus) => {
        try {
            await updateStatusMutation.mutateAsync({ id, estatus: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const canCancelOrder = () => {
        if (!order || order.status !== 'pendiente') return false;
        const createdAt = new Date(order.createdAt);
        const now = new Date();
        const diffInMinutes = (now - createdAt) / (1000 * 60);
        return diffInMinutes <= 10;
    };

    const calculateSubtotal = () => {
        if (!order) return 0;
        return order.details.reduce((sum, item) => sum + (item.listPrice * item.quantity), 0);
        // return 0;
    };

    const calculateTotalDiscount = () => {
        if (!order) return 0;
        return order.details.reduce((sum, item) => {
            const itemDiscount = (item.listPrice * item.quantity) * (item.discount / 100);
            return sum + itemDiscount;
        }, 0);
        // return 0;
    };

    if (isLoading) return <LoadingSpinner message="Cargando detalles del pedido..." />;

    if (error || !order) {
        return (
        <div className="text-center py-12">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Error al cargar el pedido</p>
            <button
                onClick={() => navigate('/pedidos')}
                className="text-blue-600 hover:text-blue-800"
            >
                Volver a la lista
            </button>
        </div>
        );
    }

    const subtotal = calculateSubtotal();
    const itemsDiscount = calculateTotalDiscount();
    const generalDiscount = subtotal * (order.descuentoGeneral / 100);


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/pedidos')}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Pedido #{order.id}
                        </h1>
                        <p className="text-gray-600">
                            Creado el {new Date(order.createdAt).toLocaleString('es-MX')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <StatusBadge status={order.status.toLowerCase()} />
                    {order.status === 'pendiente' && (
                        <div className="flex space-x-2">
                        <button
                            onClick={() => handleStatusChange('entregado')}
                            disabled={updateStatusMutation.isLoading}
                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como Entregado
                        </button>
                        {canCancelOrder() && (
                            <button
                                onClick={() => handleStatusChange('cancelado')}
                                disabled={updateStatusMutation.isLoading}
                                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancelar
                            </button>
                        )}
                        </div>
                    )}
                </div>
            </div>

            {/* Información principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del cliente */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Información del Cliente
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Nombre</p>
                            <p className="font-medium text-lg">{order.customerName}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    Email
                                </p>
                                <p className="font-medium">{order.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    Teléfono
                                </p>
                                <p className="font-medium">{order.customerPhone}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                Dirección
                            </p>
                            <p className="font-medium">{order?.customerDirection}</p>
                        </div>
                    </div>
                </div>

                {/* Información de la venta */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Store className="w-5 h-5 mr-2" />
                        Información de la Venta
                    </h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Vendedor</p>
                                <p className="font-medium">{order.sellerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tienda</p>
                                <p className="font-medium">{order.storeId}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Fecha de creación
                                </p>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString('es-MX')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    Total
                                </p>
                                <p className="font-bold text-xl text-blue-600">
                                    ${order.totalAmount?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {order.descuentoGeneral > 0 && (
                            <div>
                                <p className="text-sm text-gray-600">Descuento General</p>
                                <p className="font-medium text-green-600">{order.descuentoGeneral}%</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Productos ({order.details?.length || 0})
                    </h2>
                </div>
                <div className="p-6">
                    {order.details && order.details.length > 0 ? (
                        <div className="space-y-4">
                            {order.details.map((item, index) => (
                                <div key={item.hawaId || index} className="flex items-center justify-between py-4 border-b last:border-b-0">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-lg">{item.productName}</h4>
                                        <p className="text-gray-600 text-sm mt-1">{item.descripcion}</p>
                                        <p className="text-gray-500 text-sm">HAWA: {item.hawaId}</p>
                                        <div className="flex items-center mt-2 space-x-6 text-sm text-gray-600">
                                            <span>Cantidad: {item.quantity}</span>
                                            <span>Precio unitario: ${item.listPrice?.toLocaleString()}</span>
                                            {item.discount > 0 && (
                                                <span className="text-green-600">
                                                Descuento: {item.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right ml-6">
                                        <p className="font-bold text-lg">
                                        ${item.subtotal?.toLocaleString()}
                                        </p>
                                        {item.descuento > 0 && (
                                        <p className="text-sm text-gray-500 line-through">
                                            ${(item.listPrice * item.quantity)?.toLocaleString()}
                                        </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">
                            No hay productos en este pedido
                        </p>
                    )}
                </div>
            </div>

            {/* Resumen de costos */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Resumen de Costos
                </h2>
                <div className="space-y-3 max-w-md ml-auto">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${subtotal?.toLocaleString()}</span>
                    </div>
                    
                    {itemsDiscount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Descuentos por producto</span>
                            <span className="text-green-600">-${itemsDiscount?.toLocaleString()}</span>
                        </div>
                    )}
                    
                    {generalDiscount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Descuento general ({order.descuentoGeneral}%)</span>
                            <span className="text-green-600">-${generalDiscount?.toLocaleString()}</span>
                        </div>
                    )}
                    
                    <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Final</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ${order.totalAmount?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de auditoría */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-3">Información de Auditoría</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                        <p className="font-medium">Fecha de creación</p>
                        <p>{new Date(order.fechaCreacion).toLocaleString('es-MX')}</p>
                    </div>
                    <div>
                        <p className="font-medium">IP de usuario</p>
                        <p>{order.ipUsuario || 'No disponible'}</p>
                    </div>
                    <div>
                        <p className="font-medium">Última actualización</p>
                        <p>{new Date(order.fechaActualizacion || order.fechaCreacion).toLocaleString('es-MX')}</p>
                    </div>
                </div>
            </div>

            {/* Advertencia sobre cancelación */}
            {order.estatus === 'pendiente' && !canCancelOrder() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                        <strong>Nota:</strong> Este pedido ya no puede ser cancelado. 
                        Solo se permite la cancelación dentro de los primeros 10 minutos después de la creación.
                    </p>
                </div>
            )}
            </div>
    );
}