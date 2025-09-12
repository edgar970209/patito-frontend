
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X, TrendingUp, TrendingDown, Package, Hash } from 'lucide-react';
import {LoadingSpinner} from '../common/LoadingSpinner';

const validationSchema = Yup.object({
  cantidad: Yup.number()
    .required('La cantidad es requerida')
    .min(1, 'La cantidad debe ser mayor a 0'),
  motivo: Yup.string()
    .required('El motivo es requerido')
    .min(3, 'El motivo debe tener al menos 3 caracteres')
});

export const StockAdjustmentModal = ({ product, action, isOpen, onClose, onSubmit, isLoading }) => {
    if (!isOpen || !product) return null;

    const isIncrement = action === 'increment';
    const icon = isIncrement ? TrendingUp : TrendingDown;
    const title = isIncrement ? 'Incrementar Stock' : 'Decrementar Stock';
    const buttonText = isIncrement ? 'Incrementar' : 'Decrementar';
    const colorClass = isIncrement ? 'text-green-600' : 'text-orange-600';
    const bgColorClass = isIncrement ? 'bg-green-50' : 'bg-orange-50';
    const buttonClass = isIncrement ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700';

    const initialValues = {
        hawaId: product.hawaId,
        stockQuantity: '',
        motivo: ''
    };

    const handleSubmit = async (values) => {
        try {
            const stockData = {
                hawa: values.hawa,
                stockQuantity: parseInt(values.stockQuantity),
                motivo: values.motivo
            };
            
            await onSubmit(stockData);
            onClose();
        } catch (error) {
            // Error manejado por el hook
            console.log(error);
        
        }
    };

    const motivosComunes = isIncrement 
        ? [
            'Recepción de mercancía',
            'Devolución de cliente',
            'Ajuste de inventario',
            'Corrección de error',
            'Reabastecimiento'
        ]
        : [
            'Venta directa',
            'Producto dañado',
            'Ajuste de inventario',
            'Corrección de error',
            'Transferencia a otra tienda'
        ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        {React.createElement(icon, { className: `w-5 h-5 mr-2 ${colorClass}` })}
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Product Info */}
                <div className={`p-6 border-b ${bgColorClass}`}>
                    <div className="flex items-center space-x-3">
                        <Package className="w-8 h-8 text-gray-400" />
                        <div>
                        <h3 className="font-medium text-gray-900">{product.productName}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                            <Hash className="w-3 h-3 mr-1" />
                            {product.hawaId}
                        </p>
                        <p className="text-sm text-gray-600">
                            Stock actual: <span className="font-medium">{product.stockQuantity} unidades</span>
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
                {({ values, setFieldValue }) => (
                    <Form className="p-6 space-y-6">
                        {/* Cantidad */}
                        <div>
                            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Cantidad a {isIncrement ? 'agregar' : 'quitar'} *
                            </label>
                            <Field
                                type="number"
                                id="stockQuantity"
                                name="stockQuantity"
                                min="1"
                                max={!isIncrement ? product.stockQuantity : undefined}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ingrese la cantidad"
                            />
                            <ErrorMessage name="stockQuantity" component="p" className="mt-1 text-sm text-red-600" />
                            
                            {!isIncrement && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Máximo disponible: {product.stockQuantity} unidades
                                </p>
                            )}
                        </div>

                        {/* Motivo */}
                        <div>
                            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                                Motivo del ajuste *
                            </label>
                            <Field
                                as="select"
                                id="motivo"
                                name="motivo"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => {
                                    setFieldValue('motivo', e.target.value);
                                }}
                            >
                                <option value="">Seleccione un motivo</option>
                                {motivosComunes.map((motivo, index) => (
                                    <option key={index} value={motivo}>
                                    {motivo}
                                    </option>
                                ))}
                                <option value="otro">Otro (especificar abajo)</option>
                            </Field>
                            <ErrorMessage name="motivo" component="p" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Motivo personalizado */}
                        {values.motivo === 'otro' && (
                            <div>
                                <label htmlFor="motivoPersonalizado" className="block text-sm font-medium text-gray-700 mb-1">
                                    Especifique el motivo
                                </label>
                                <Field
                                    type="text"
                                    id="motivoPersonalizado"
                                    name="motivoPersonalizado"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Descripción del motivo"
                                    onChange={(e) => {
                                    setFieldValue('motivo', e.target.value);
                                    }}
                                />
                            </div>
                        )}

                        {/* Preview del cambio */}
                        {values.stockQuantity && (
                            <div className={`p-4 rounded-lg ${bgColorClass}`}>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Vista Previa del Cambio</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Stock actual:</span>
                                        <p className="font-medium">{product.stockQuantity}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">{isIncrement ? 'Agregar:' : 'Quitar:'}</span>
                                        <p className={`font-medium ${colorClass}`}>
                                            {isIncrement ? '+' : '-'}{values.stockQuantity}
                                        </p>
                                        </div>
                                    <div>
                                        <span className="text-gray-600">Stock final:</span>
                                        <p className="font-medium">
                                            {isIncrement 
                                            ? product.stockQuantity + parseInt(values.stockQuantity || 0)
                                            : product.stockQuantity - parseInt(values.stockQuantity || 0)
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Advertencia para decrementos */}
                        {!isIncrement && values.cantidad && parseInt(values.stockQuantity) > product.stockQuantity && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm">
                                    ⚠️ La cantidad a decrementar es mayor al stock disponible.
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || (!isIncrement && values.stockQuantity && parseInt(values.stockQuantity) > product.stockQuantity)}
                                className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${buttonClass}`}
                            >
                                {isLoading ? (
                                    <>
                                    <LoadingSpinner size="small" message="" />
                                    <span className="ml-2">Procesando...</span>
                                    </>
                                ) : (
                                    <span>{buttonText} Stock</span>
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
