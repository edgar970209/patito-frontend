
import { FileText, User, Globe, Calendar, Package, ShoppingCart, Edit } from 'lucide-react';

export const AuditTable = ({ records }) => {
    const getActionIcon = (action) => {
        if (action?.includes('crear') || action?.includes('CREATE')) {
        return <Package className="w-4 h-4 text-green-600" />;
        } else if (action?.includes('actualizar') || action?.includes('UPDATE')) {
        return <Edit className="w-4 h-4 text-blue-600" />;
        } else if (action?.includes('eliminar') || action?.includes('DELETE')) {
        return <FileText className="w-4 h-4 text-red-600" />;
        } else if (action?.includes('pedido') || action?.includes('order')) {
        return <ShoppingCart className="w-4 h-4 text-purple-600" />;
        }
        return <FileText className="w-4 h-4 text-gray-600" />;
    };

    const getActionBadge = (action) => {
        if (action?.includes('crear') || action?.includes('CREATE')) {
        return 'bg-green-100 text-green-800';
        } else if (action?.includes('actualizar') || action?.includes('UPDATE')) {
        return 'bg-blue-100 text-blue-800';
        } else if (action?.includes('eliminar') || action?.includes('DELETE')) {
        return 'bg-red-100 text-red-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const formatEntityType = (entityType) => {
        const translations = {
        'order': 'Pedido',
        'product': 'Producto',
        'inventory': 'Inventario',
        'user': 'Usuario',
        'auth': 'Autenticación'
        };
        return translations[entityType?.toLowerCase()] || entityType;
    };

    if (records.length === 0) {
        return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Registros de Auditoría</h2>
            </div>
            <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron registros de auditoría</p>
            </div>
        </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
            Registros de Auditoría ({records.length})
            </h2>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, index) => (
                <tr key={record.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        {getActionIcon(record.accion)}
                        <div className="ml-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadge(record.accion)}`}>
                            {record.accion}
                        </span>
                        </div>
                    </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                        {formatEntityType(record.entidadTipo)}
                        </div>
                        <div className="text-sm text-gray-500">
                        ID: {record.entidadId}
                        </div>
                    </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                        <div className="text-sm font-medium text-gray-900">
                            {record.usuario || 'Sistema'}
                        </div>
                        </div>
                    </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 font-mono">
                        {record.ip || 'N/A'}
                        </span>
                    </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                        <div className="text-sm text-gray-900">
                            {new Date(record.fechaEvento).toLocaleDateString('es-MX')}
                        </div>
                        <div className="text-sm text-gray-500">
                            {new Date(record.fechaEvento).toLocaleTimeString('es-MX')}
                        </div>
                        </div>
                    </div>
                    </td>
                    
                    <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                        {record.detalles ? (
                        <div className="truncate" title={record.detalles}>
                            {record.detalles}
                        </div>
                        ) : (
                        <span className="text-gray-400">Sin detalles</span>
                        )}
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {/* Paginación si hay muchos registros */}
        {records.length > 50 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a{' '}
                <span className="font-medium">{Math.min(50, records.length)}</span> de{' '}
                <span className="font-medium">{records.length}</span> registros
                </div>
                <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                    Anterior
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Siguiente
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};
