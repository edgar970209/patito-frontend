import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrder } from '../hooks/useOrders';
import { CreditCard, Package, ShoppingCart, User } from 'lucide-react';
import { clearCurrentOrder, updateOrderInfo } from '../store/slices/orderSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { CustomerForm } from '../components/forms/CustomerForm';
import { ProductSearch } from '../components/products/ProductSearch';
import { OrderSummary } from '../components/orders/OrderSummary';
import { OrderConfirmation } from '../components/orders/OrderConfirmation';



const validationSchema = Yup.object({
    vendedor: Yup.string().required('El nombre del vendedor es requerido'),
    tienda: Yup.string().required('El identificador de tienda es requerido'),
    customer: Yup.object({
        nombre: Yup.string().required('El nombre del cliente es requerido'),
        email: Yup.string().email('Email inválido').required('El email es requerido'),
        telefono: Yup.string().required('El teléfono es requerido'),
        direccion: Yup.string().required('La dirección es requerida')
    })
});


export const CreateOrderPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentOrder = useSelector((state) => state.order.currentOrder);
    const createOrderMutation = useCreateOrder();

    const [step, setStep] = useState(1);
    const [orderData, setOrderData] = useState(null);

    const steps = [
        { id: 1, title: 'Información Básica', icon: User },
        { id: 2, title: 'Seleccionar Productos', icon: Package },
        { id: 3, title: 'Resumen del Pedido', icon: ShoppingCart },
        { id: 4, title: 'Confirmación', icon: CreditCard }
    ];

    const initialValues = {
        vendedor: currentOrder.vendedor || '',
        tienda: currentOrder.tienda || '',
        descuentoGeneral: currentOrder.descuentoGeneral || 0,
        customer: {
        nombre: currentOrder.customer.nombre || '',
        email: currentOrder.customer.email || '',
        telefono: currentOrder.customer.telefono || '',
        direccion: currentOrder.customer.direccion || ''
        }
    };

    const handleSubmitOrder = async (values) => {
        try {

            const orderDetail = [];
            
            currentOrder.items.map((item) => {
                const valueItem = {
                    hawaId: item.hawa,
                    quantity: item.cantidad,
                    discount: item.descuento
                }

                orderDetail.push(valueItem);
            });

            const orderPayload = {
                storeId: values.tienda,
                sellerName: values.vendedor,
                customerName: values.customer.nombre,
                customerEmail: values.customer.email,
                customerPhone: values.customer.telefono,
                details: orderDetail
            }

            const result = await createOrderMutation.mutateAsync(orderPayload);
            setOrderData(result);
            setStep(4);
            dispatch(clearCurrentOrder());
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: 'Error al crear el pedido. Intente nuevamente.' + error
            }));
        }
    };

    const handleStepForward = (values) => {
        // Actualizar el estado global con los datos del formulario
        dispatch(updateOrderInfo({
            vendedor: values.vendedor,
            tienda: values.tienda,
            descuentoGeneral: values.descuentoGeneral,
            customer: values.customer
        }));

        if (step === 3) {
        // Enviar el pedido
            handleSubmitOrder(values);
        } else {
            setStep(step + 1);
        }
    };

    const handleStepBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const canProceedToNext = () => {
        switch (step) {
            case 1:
                return true; // Validación manejada por Formik
            case 2:
                return currentOrder.items.length > 0;
            case 3:
                return currentOrder.items.length > 0;
            default:
                return false;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((stepItem, index) => {
                        const Icon = stepItem.icon;
                        const isActive = step === stepItem.id;
                        const isCompleted = step > stepItem.id;
                        
                        return (
                        <div key={stepItem.id} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                isActive 
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : isCompleted
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                    {stepItem.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`mx-4 w-16 h-0.5 ${
                                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                        );
                    })}
                </div>
            </div>

        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleStepForward(values)}
            enableReinitialize
        >
            {({ values, isValid }) => (
                <Form>
                    <div className="bg-white rounded-lg shadow p-6">
                        {/* Step Content */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Información Básica del Pedido</h2>
                                <CustomerForm />
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Seleccionar Productos</h2>
                                <ProductSearch tiendaId={values.tienda} />
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>
                                <OrderSummary orderData={values} />
                            </div>
                        )}

                        {step === 4 && orderData && (
                            <div>
                                <OrderConfirmation orderData={orderData} />
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 4 && (
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={handleStepBack}
                                    disabled={step === 1}
                                    className={`px-4 py-2 rounded-md font-medium ${
                                    step === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Anterior
                                </button>

                                <button
                                    type="submit"
                                    disabled={!canProceedToNext() || (step === 1 && !isValid) || createOrderMutation.isLoading}
                                    className={`px-6 py-2 rounded-md font-medium ${
                                    !canProceedToNext() || (step === 1 && !isValid)
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {createOrderMutation.isLoading 
                                    ? 'Procesando...' 
                                    : step === 3 
                                    ? 'Crear Pedido' 
                                    : 'Siguiente'
                                    }
                                </button>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex justify-center mt-8 pt-6 border-t space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/pedidos')}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                                >
                                    Ver Todos los Pedidos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                    setStep(1);
                                    setOrderData(null);
                                    dispatch(clearCurrentOrder());
                                    }}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
                                >
                                    Crear Nuevo Pedido
                                </button>
                            </div>
                        )}
                    </div>
                </Form>
            )}
        </Formik>
        </div>
    );
}