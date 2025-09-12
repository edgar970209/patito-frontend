
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TrendingUp, TrendingDown, X, Package, Hash, Store } from 'lucide-react';

// Esquema de validación
const validationSchema = Yup.object({
    orderStatus: Yup.string().required('El estatus es requerido'),
    reason: Yup.string().required('El motivo es requerido'),
    motivoPersonalizado: Yup.string().when('reason', {
        is: 'otro',
        then: (schema) => schema.required('Especifique el motivo personalizado'),
        otherwise: (schema) => schema.notRequired()
    })
});

export const OrderStatusModal = ({ order, isOpen, onClose, onSubmit, isLoading }) => {
    
    if (!isOpen || !order) return null;

    const initialValues = {
        orderStatus: '',
        reason: '',
        motivoPersonalizado: ''
    };

    // Función corregida de handleSubmit
    const handleSubmit = async (values, { setSubmitting }) => {
        console.log(values);
        
        try {

            const motivo = values.reason === 'otro' ? values.motivoPersonalizado : values.reason;
            const estatusData = {
                id: order.id,
                OrderStatus: values.orderStatus,
                reason: motivo
            };


            await onSubmit(estatusData);
            onClose();
        } catch (error) {
            console.error('Error en ajuste de stock:', error);
        } finally {
            setSubmitting(false);
        }
    };

   const motivosComunes = [
        'Pedido entregado',
        'Recibido por vecino',
        'Entregado en vigilancia',
        'Dejado en puerta'
    ];

    const estatusActualizar = [
        'ENTREGADO',
        'CANCELADO'
    ]

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        {/* {createElement(icon, { className: `w-5 h-5 mr-2 ${colorClass}` })} */}
                        Actualizar estatus pedido
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Product Info */}
                <div className={`p-6 border-b bg-green-50`}>
                    <div className="flex items-center space-x-3">
                        <Package className="w-8 h-8 text-gray-400" />
                        <div>
                            <h3 className="font-medium text-gray-900">{order.details[0].productName}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                {order.details[0].hawaId}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                                <Store className="w-3 h-3 mr-1" />
                                {order.storeId}
                            </p>
                            <p className="text-sm text-gray-600">
                                Nombre cliente: <span className="font-medium">{order.customerName} </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Nombre reportidor: <span className="font-medium">{order.sellerName} </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, isSubmitting }) => (
                        <Form className="p-6 space-y-6">
                            {/* Cantidad */}
                            <div>
                                <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                    Estatus
                                </label>
                                <Field
                                    as="select"
                                    id="orderStatus"
                                    name="orderStatus"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione el estatus</option>
                                    {estatusActualizar.map((estatus, index) => (
                                        <option key={index} value={estatus}>
                                            {estatus}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="orderStatus" component="p" className="mt-1 text-sm text-red-600" />
                                
                            </div>

                            {/* Motivo */}
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Motivo del ajuste *
                                </label>
                                <Field
                                    as="select"
                                    id="reason"
                                    name="reason"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione un motivo</option>
                                    {motivosComunes.map((motivo, index) => (
                                        <option key={index} value={motivo}>
                                            {motivo}
                                        </option>
                                    ))}
                                    <option value="otro">Otro (especificar abajo)</option>
                                </Field>
                                <ErrorMessage name="reason" component="p" className="mt-1 text-sm text-red-600" />
                            </div>

                            {/* Motivo personalizado */}
                            {values.reason === 'otro' && (
                                <div>
                                    <label htmlFor="motivoPersonalizado" className="block text-sm font-medium text-gray-700 mb-1">
                                        Especifique el motivo *
                                    </label>
                                    <Field
                                        type="text"
                                        id="motivoPersonalizado"
                                        name="motivoPersonalizado"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Descripción del motivo"
                                    />
                                    <ErrorMessage name="motivoPersonalizado" component="p" className="mt-1 text-sm text-red-600" />
                                </div>
                            )}



                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    disabled={isLoading || isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    disabled={
                                        isLoading || 
                                        isSubmitting || 
                                        (values.reason === 'otro' && !values.motivoPersonalizado)
                                    }
                                    className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center bg-green-600 hover:bg-green-700`}
                                >
                                    {(isLoading || isSubmitting) ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            <span>Procesando...</span>
                                        </>
                                    ) : (
                                        <span>Actualizar Estatus</span>
                                    )}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};