
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X, Package, DollarSign, Hash, FileText, Percent } from 'lucide-react';
import {LoadingSpinner} from '../common/LoadingSpinner';

const validationSchema = Yup.object({
    hawaId: Yup.string()
        .required('El código HAWA es requerido')
        .min(3, 'El código debe tener al menos 3 caracteres'),
    productName: Yup.string()
        .required('El nombre es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: Yup.string()
        .required('La descripción es requerida'),
    listPrice: Yup.number()
        .required('El precio es requerido')
        .min(0, 'El precio debe ser mayor a 0'),
    stockQuantity: Yup.number()
        .required('Las existencias son requeridas')
        .min(0, 'Las existencias deben ser mayor o igual a 0'),
    discount: Yup.number()
        .min(0, 'El descuento debe ser mayor o igual a 0')
        .max(100, 'El descuento no puede ser mayor a 100%'),
    stockMinimo: Yup.number()
        .min(0, 'El stock mínimo debe ser mayor o igual a 0')
});

export const ProductModal = ({ product, isOpen, onClose, onSubmit, isLoading }) => {
    
    if (!isOpen) return null;

    const initialValues = {
        hawaId: product?.hawaId || '',
        productName: product?.productName || '',
        descripcion: product?.descripcion || '',
        listPrice: product?.listPrice || '',
        stockQuantity: product?.stockQuantity || 0,
        discount: product?.discount || 0,
        stockMinimo: product?.stockMinimo || 5
    };

    const handleSubmit = async (values) => {
        try {
            if (product) {
                // Actualizar producto existente
                await onSubmit({ hawa: product.hawaId, updateData: values });
            } else {
                // Crear nuevo producto
                await onSubmit(values);
            }
            onClose();
        } catch (error) {
        // Error manejado por el hook
            console.log(error);
            
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                {({ values }) => (
                    <Form className="p-6 space-y-6">
                        {/* HAWA */}
                        <div>
                            <label htmlFor="hawa" className="block text-sm font-medium text-gray-700 mb-1">
                            <Hash className="w-4 h-4 inline mr-1" />
                                Código HAWA *
                            </label>
                            <Field
                                type="text"
                                id="hawaId"
                                name="hawaId"
                                disabled={!!product} // No permitir editar HAWA en productos existentes
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Código único del producto"
                            />
                            <ErrorMessage name="hawaId" component="p" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Nombre */}
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                            <Package className="w-4 h-4 inline mr-1" />
                                Nombre del Producto *
                            </label>
                            <Field
                                type="text"
                                id="productName"
                                name="productName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nombre descriptivo del producto"
                            />
                            <ErrorMessage name="productName" component="p" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                            <FileText className="w-4 h-4 inline mr-1" />
                                Descripción *
                            </label>
                            <Field
                                as="textarea"
                                id="descripcion"
                                name="descripcion"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Descripción detallada del producto"
                            />
                            <ErrorMessage name="descripcion" component="p" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Precio y Descuento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="listPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Precio de Lista *
                                </label>
                                <Field
                                    type="number"
                                    id="listPrice"
                                    name="listPrice"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                                <ErrorMessage name="listPrice" component="p" className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                                    <Percent className="w-4 h-4 inline mr-1" />
                                    Descuento (%)
                                </label>
                                <Field
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                                <ErrorMessage name="discount" component="p" className="mt-1 text-sm text-red-600" />
                            </div>
                        </div>

                        {/* Existencias y Stock Mínimo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Existencias Actuales *
                                </label>
                                <Field
                                    type="number"
                                    id="stockQuantity"
                                    name="stockQuantity"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                                <ErrorMessage name="stockQuantity" component="p" className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                                <label htmlFor="stockMinimo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Mínimo
                                </label>
                                <Field
                                    type="number"
                                    id="stockMinimo"
                                    name="stockMinimo"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="5"
                                />
                                <ErrorMessage name="stockMinimo" component="p" className="mt-1 text-sm text-red-600" />
                                <p className="mt-1 text-xs text-gray-500">
                                    Cantidad mínima antes de considerar bajo stock
                                </p>
                            </div>
                        </div>

                        {/* Preview de precio con descuento */}
                        {values.listPrice && values.discount > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Vista Previa de Precios</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Precio original:</span>
                                        <p className="font-medium">${parseFloat(values.listPrice).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Precio con descuento:</span>
                                        <p className="font-medium text-green-600">
                                            ${(parseFloat(values.listPrice) * (1 - parseFloat(values.discount || 0) / 100)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Valor total del inventario */}
                        {values.precioLista && values.existencias && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Valor del Inventario</h4>
                            <p className="text-lg font-semibold text-blue-600">
                                ${(parseFloat(values.precioLista) * parseInt(values.existencias || 0)).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">
                                {values.existencias} unidades × ${parseFloat(values.precioLista).toLocaleString()}
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
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                    <LoadingSpinner size="small" message="" />
                                    <span className="ml-2">Guardando...</span>
                                    </>
                                ) : (
                                    <span>{product ? 'Actualizar Producto' : 'Crear Producto'}</span>
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
