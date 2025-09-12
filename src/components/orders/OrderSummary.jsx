import { CreditCard, Package, Store, User } from 'lucide-react';
import { useSelector } from 'react-redux';



export const OrderSummary = ({ orderData }) => {
    

    const currentOrder = useSelector((state) => state.order.currentOrder);
    

    const calculateSubtotal = () => {
        return currentOrder.items.reduce((sum, item) => sum + (item.precioLista * item.cantidad), 0);
    };

    const calculateTotalDiscount = () => {
        return currentOrder.items.reduce((sum, item) => {
        const itemDiscount = (item.precioLista * item.cantidad) * (item.descuento / 100);
        return sum + itemDiscount;
        }, 0);
    };

    const calculateGeneralDiscount = () => {
        const subtotal = calculateSubtotal();
        return subtotal * (orderData.descuentoGeneral / 100);
    };

    const subtotal = calculateSubtotal();
    const itemsDiscount = calculateTotalDiscount();
    const generalDiscount = calculateGeneralDiscount();
    const finalTotal = subtotal - itemsDiscount - generalDiscount;


    return (
    <div className="space-y-6">
        {/* Información del Cliente */}
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium">{orderData.customer.nombre}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{orderData.customer.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{orderData.customer.telefono}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{orderData.customer.direccion}</p>
                </div>
            </div>
        </div>

        {/* Información de la Tienda */}
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Store className="w-5 h-5 mr-2" />
                Información de la Venta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Vendedor</p>
                    <p className="font-medium">{orderData.vendedor}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Tienda</p>
                    <p className="font-medium">{orderData.tienda}</p>
                </div>
                {orderData.descuentoGeneral > 0 && (
                    <div>
                        <p className="text-sm text-gray-600">Descuento General</p>
                        <p className="font-medium text-green-600">{orderData.descuentoGeneral}%</p>
                    </div>
                )}
            </div>
        </div>

        {/* Productos */}
        <div className="bg-white border rounded-lg">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Productos ({currentOrder.items.length})
                </h3>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {currentOrder.items.map((item) => (
                    <div key={item.hawa} className="flex items-center justify-between py-4 border-b last:border-b-0">
                        <div className="flex-1">
                            <h4 className="font-medium">{item.nombre}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.descripcion}</p>
                            <p className="text-sm text-gray-500">HAWA: {item.hawa}</p>
                            <div className="flex items-center mt-2 space-x-4">
                                <span className="text-sm text-gray-600">
                                    Cantidad: {item.cantidad}
                                </span>
                                <span className="text-sm text-gray-600">
                                    Precio unitario: ${item.precioLista?.toLocaleString()}
                                </span>
                                {item.descuento > 0 && (
                                    <span className="text-sm text-green-600">
                                        Descuento: {item.descuento}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right ml-4">
                        <p className="font-medium text-lg">
                            ${item.subtotal?.toLocaleString()}
                        </p>
                        {item.descuento > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                            ${(item.precioLista * item.cantidad)?.toLocaleString()}
                            </p>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Resumen de Costos */}
        <div className="bg-white border rounded-lg">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Resumen de Costos
                </h3>
            </div>
            <div className="p-6">
                <div className="space-y-3">
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
                            <span className="text-gray-600">Descuento general ({orderData.descuentoGeneral}%)</span>
                            <span className="text-green-600">-${generalDiscount?.toLocaleString()}</span>
                        </div>
                    )}
                    
                    <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Final</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ${finalTotal?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Información de Auditoría */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Información de Auditoría</h4>
            <div className="text-sm text-yellow-700 space-y-1">
                <p>Fecha: {new Date().toLocaleString('es-MX')}</p>
                <p>IP del usuario: {window.location.hostname}</p>
                <p>Estatus inicial: Pendiente</p>
            </div>
        </div>

        {/* Advertencias */}
        {currentOrder.items.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">
                    No hay productos en el pedido. Agrega al menos un producto para continuar.
                </p>
            </div>
        )}
        </div>
    );
}