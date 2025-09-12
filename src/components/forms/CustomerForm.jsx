import { ErrorMessage, Field } from "formik";
import { Mail, MapPin, Percent, Phone, Store, User, UserCheck } from "lucide-react";



export const CustomerForm = () => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de la tienda y vendedor */}
            <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    Información de la Tienda
                </h3>
            </div>

            <div>
                <label htmlFor="vendedor" className="block text-sm font-medium text-gray-700 mb-1">
                    <UserCheck className="w-4 h-4 inline mr-1" />
                    Nombre del Vendedor *
                </label>
                <Field
                    type="text"
                    id="vendedor"
                    name="vendedor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo del vendedor"
                />
                <ErrorMessage name="vendedor" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
                <label htmlFor="tienda" className="block text-sm font-medium text-gray-700 mb-1">
                    <Store className="w-4 h-4 inline mr-1" />
                    ID de Tienda *
                </label>
                <Field
                    type="text"
                    id="tienda"
                    name="tienda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Identificador de la tienda"
                />
                <ErrorMessage name="tienda" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
                <label htmlFor="descuentoGeneral" className="block text-sm font-medium text-gray-700 mb-1">
                    <Percent className="w-4 h-4 inline mr-1" />
                    Descuento General (%)
                </label>
                <Field
                    type="number"
                    id="descuentoGeneral"
                    name="descuentoGeneral"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                />
                <ErrorMessage name="descuentoGeneral" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Información del cliente */}
            <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información del Cliente
                </h3>
            </div>

            <div>
                <label htmlFor="customer.nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Nombre Completo *
                </label>
                <Field
                    type="text"
                    id="customer.nombre"
                    name="customer.nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo del cliente"
                />
                <ErrorMessage name="customer.nombre" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
                <label htmlFor="customer.email" className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Correo Electrónico *
                </label>
                <Field
                    type="email"
                    id="customer.email"
                    name="customer.email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="correo@ejemplo.com"
                />
                <ErrorMessage name="customer.email" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
                <label htmlFor="customer.telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                </label>
                <Field
                    type="tel"
                    id="customer.telefono"
                    name="customer.telefono"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+52 55 1234 5678"
                />
                <ErrorMessage name="customer.telefono" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
                <label htmlFor="customer.direccion" className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección *
                </label>
                <Field
                    as="textarea"
                    id="customer.direccion"
                    name="customer.direccion"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dirección completa de entrega"
                />
                <ErrorMessage name="customer.direccion" component="p" className="mt-1 text-sm text-red-600" />
            </div>
        </div>
    );
}