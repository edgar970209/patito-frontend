
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Truck, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useLogin, useAuthState } from '../hooks/userAuth';
import {LoadingSpinner} from '../components/common/LoadingSpinner';

const validationSchema = Yup.object({
    username: Yup.string()
        .required('El usuario es requerido'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida')
});

export const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthState();
    const loginMutation = useLogin();
    const [showPassword, setShowPassword] = React.useState(false);

    useEffect(() => {
        if (isAuthenticated) {
        navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (values) => {
        try {
            await loginMutation.mutateAsync(values);
            navigate('/', { replace: true });
        } catch (error) {
            // Error manejado por el hook
            console.log(error);
            
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
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Accede al sistema de pedidos de Tiendas Patito
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    <Formik
                        initialValues={{
                            username: '',
                            password: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Usuario
                                    </label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="hello"
                                    />
                                    <ErrorMessage name="username" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

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

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loginMutation.isLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loginMutation.isLoading ? (
                                            <LoadingSpinner size="small" message="" />
                                        ) : (
                                            'Iniciar Sesión'
                                        )}
                                    </button>
                                </div>

                                {/* Links */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        ¿No tienes una cuenta?{' '}
                                        <Link
                                            to="/register"
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Regístrate aquí
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
