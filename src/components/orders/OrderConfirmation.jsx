import { Calendar, CheckCircle, DollarSign, Package, User } from "lucide-react";



export const OrderConfirmation = ({ orderData }) => {

    return (
        <div className="text-center space-y-6">
            {/* Icono de éxito */}
            <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
            </div>

            {/* Mensaje principal */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Pedido Creado Exitosamente!
                </h2>
                <p className="text-gray-600">
                    Tu pedido ha sido registrado y está siendo procesado
                </p>
            </div>

            {/* Información del pedido */}
            <div className="bg-white border-2 border-green-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-600">
                            <Package className="w-4 h-4 mr-2" />
                            Número de Pedido
                        </span>
                        <span className="font-semibold text-lg">#{orderData.id}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            Cliente
                        </span>
                        <span className="font-medium">{orderData.customerName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Fecha
                        </span>
                        <span className="font-medium">
                            {new Date(orderData.createdAt).toLocaleDateString('es-MX')}
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Total
                        </span>
                        <span className="font-bold text-xl text-green-600">
                            ${orderData.totalAmount?.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Estado del pedido */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-yellow-800 font-medium">Estado: Pendiente</span>
                </div>
                <p className="text-yellow-700 text-sm mt-2">
                    El pedido está en proceso de validación y será procesado en breve
                </p>
            </div>

            {/* Información adicional */}
            <div className="text-left bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Próximos pasos:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        El equipo de inventario validará la disponibilidad
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Recibirás una confirmación por email
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Se coordinará la entrega con el cliente
                    </li>
                </ul>
            </div>

            {/* Nota importante */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-800 text-sm">
                    <strong>Recordatorio:</strong> Los pedidos pueden cancelarse únicamente dentro de los primeros 10 minutos después de su creación.
                </p>
            </div>
        </div>
    );
}