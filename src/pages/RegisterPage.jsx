
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Truck, User, Mail, Lock, Store, Eye, EyeOff, Phone } from 'lucide-react';
import { useRegister } from '../hooks/userAuth';
import {LoadingSpinner} from '../components/common/LoadingSpinner';

const validationSchema = Yup.object({
    firstName: Yup.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .required('El nombre es requerido'),
    email: Yup.string()
        .email('Email inválido')
        .required('El email es requerido'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('La confirmación de contraseña es requerida'),
    storeId: Yup.string()
        .required('El ID de tienda es requerido'),
    
});

export const RegisterPage = () => {
    const navigate = useNavigate();
    const registerMutation = useRegister();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleSubmit = async (values) => {
        
        try {

            await registerMutation.mutateAsync(values);
            navigate('/login');
        } catch (error) {
        // Error manejado por el hook
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <Truck className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Regístrate en el sistema de Tiendas Patito
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            storeId: '',
                            phone: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={ handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                {/* Nombre Field */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Nombre 
                                    </label>
                                    <Field
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tu nombre"
                                    />
                                    <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-red-600" />
                                </div>
                                {/* Nombre Field */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Apellidos
                                    </label>
                                    <Field
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tus apellidos"
                                    />
                                    <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-red-600" />
                                </div>
                                {/* Nombre Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        UserName
                                    </label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tu usuario"
                                    />
                                    <ErrorMessage name="username" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Correo Electrónico
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="usuario@ejemplo.com"
                                    />
                                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

                                {/* Tienda Field */}
                                <div>
                                    <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Store className="w-4 h-4 inline mr-1" />
                                        ID de Tienda
                                    </label>
                                    <Field
                                        type="text"
                                        id="storeId"
                                        name="storeId"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="ID de la tienda"
                                    />
                                    <ErrorMessage name="storeId" component="p" className="mt-1 text-sm text-red-600" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Telefono
                                    </label>
                                    <Field
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tu telefono"
                                    />
                                    <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

                                {/* Rol Field */}
                                {/* <div>
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                                        Rol
                                    </label>
                                    <Field
                                        as="select"
                                        id="rol"
                                        name="rol"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="vendedor">Vendedor</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="admin">Administrador</option>
                                    </Field>
                                    <ErrorMessage name="rol" component="p" className="mt-1 text-sm text-red-600" />
                                </div> */}

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Lock className="w-4 h-4 inline mr-1" />
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Lock className="w-4 h-4 inline mr-1" />
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                            <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || registerMutation.isLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {registerMutation.isLoading ? (
                                            <LoadingSpinner size="small" message="" />
                                        ) : (
                                            'Crear Cuenta'
                                        )}
                                    </button>
                                </div>

                                {/* Links */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        ¿Ya tienes una cuenta?{' '}
                                        <Link
                                            to="/login"
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Inicia sesión aquí
                                        </Link>
                                    </p>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>© 2025 Tiendas Patito. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};
