
import { useState } from 'react';
import { 
    FileText, 
    Search, 
    Download, 
    Calendar,
    Users,
    Package,
    ShoppingCart
} from 'lucide-react';
import { 
    useAuditRecords, 
    useRecentAuditRecords, 
    // useAuditStats,
    // useGenerateOrderAuditReport,
    // useGenerateProductAuditReport,
    // useGenerateUserAuditReport
} from '../hooks/useAudit';
import {LoadingSpinner} from '../components/common/LoadingSpinner';
// import AuditStatsCards from '../components/audit/AuditStatsCards';
import {AuditTable} from '../components/audit/AuditTable';
// import ReportModal from '../components/audit/ReportModal';

export const AuditPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // const [showFilters, setShowFilters] = useState(false);
    // const [showReportModal, setShowReportModal] = useState(false);
    // const [reportType, setReportType] = useState('order'); // 'order' | 'product' | 'user'
    const [dateFilters, setDateFilters] = useState({
        fechaInicio: '',
        fechaFin: ''
    });

    // Hooks
    const { data: auditRecords = [], isLoading } = useAuditRecords();
    const { data: recentRecords = [] } = useRecentAuditRecords(50);
    // const { data: auditStats } = useAuditStats(dateFilters.fechaInicio, dateFilters.fechaFin);
    // const generateOrderReport = useGenerateOrderAuditReport();
    // const generateProductReport = useGenerateProductAuditReport();
    // const generateUserReport = useGenerateUserAuditReport();

    // Filtrar registros
    const filteredRecords = auditRecords.filter(record => {
        const matchesSearch = searchTerm === '' || 
        record.accion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.entidadTipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.entidadId?.toString().includes(searchTerm) ||
        record.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ip?.includes(searchTerm);

        const matchesDate = () => {
        if (!dateFilters.fechaInicio && !dateFilters.fechaFin) return true;
        
        const recordDate = new Date(record.fechaEvento);
        const startDate = dateFilters.fechaInicio ? new Date(dateFilters.fechaInicio) : null;
        const endDate = dateFilters.fechaFin ? new Date(dateFilters.fechaFin) : null;

        if (startDate && recordDate < startDate) return false;
        if (endDate && recordDate > endDate) return false;
        
        return true;
        };

        return matchesSearch && matchesDate();
    });

    const handleGenerateReport = (type) => {
        // setReportType(type);
        // setShowReportModal(true);
    };

    // const handleSubmitReport = async (reportData) => {
    //     try {
    //     switch (reportType) {
    //         case 'order':
    //         await generateOrderReport.mutateAsync(reportData);
    //         break;
    //         case 'product':
    //         await generateProductReport.mutateAsync(reportData);
    //         break;
    //         case 'user':
    //         await generateUserReport.mutateAsync(reportData);
    //         break;
    //     }
    //     setShowReportModal(false);
    //     } catch (error) {
    //     // Error manejado por el hook
    //         console.log(error);
        
    //     }
    // };

    if (isLoading) return <LoadingSpinner message="Cargando registros de auditoría..." />;

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Auditoría del Sistema</h1>
            <p className="text-gray-600 mt-1">
                Monitorea y revisa todas las actividades del sistema
            </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
                onClick={() => handleGenerateReport('order')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Download className="w-4 h-4 mr-2" />
                Generar Reporte
            </button>
            </div>
        </div>

        {/* Estadísticas */}
        {/* {auditStats && <AuditStatsCards stats={auditStats} />} */}

        {/* Cards de reportes rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
            {
                title: 'Reporte de Pedidos',
                description: 'Auditoría de creación y modificación de pedidos',
                icon: ShoppingCart,
                color: 'bg-blue-500',
                action: () => handleGenerateReport('order')
            },
            {
                title: 'Reporte de Inventario',
                description: 'Movimientos y cambios en el inventario',
                icon: Package,
                color: 'bg-green-500',
                action: () => handleGenerateReport('product')
            },
            {
                title: 'Reporte de Usuarios',
                description: 'Actividad y acciones de usuarios',
                icon: Users,
                color: 'bg-purple-500',
                action: () => handleGenerateReport('user')
            }
            ].map((report, index) => {
            const Icon = report.icon;
            return (
                <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${report.color} text-white`}>
                    <Icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                </div>
                <button
                    onClick={report.action}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Generar
                </button>
                </div>
            );
            })}
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                type="text"
                placeholder="Buscar por acción, usuario, IP..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filtros de fecha */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                    type="date"
                    value={dateFilters.fechaInicio}
                    onChange={(e) => setDateFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">a</span>
                <input
                    type="date"
                    value={dateFilters.fechaFin}
                    onChange={(e) => setDateFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                
                <button
                onClick={() => setDateFilters({ fechaInicio: '', fechaFin: '' })}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                Limpiar
                </button>
            </div>
            </div>
        </div>

        {/* Tabla de registros */}
        <AuditTable records={filteredRecords} />

        {/* Actividad reciente */}
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
            {recentRecords.length === 0 ? (
                <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay actividad reciente</p>
                </div>
            ) : (
                <div className="space-y-4">
                {recentRecords.slice(0, 10).map((record, index) => (
                    <div key={record.id || index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                        record.accion?.includes('crear') || record.accion?.includes('CREATE') 
                            ? 'bg-green-400'
                            : record.accion?.includes('actualizar') || record.accion?.includes('UPDATE')
                            ? 'bg-blue-400'
                            : record.accion?.includes('eliminar') || record.accion?.includes('DELETE')
                            ? 'bg-red-400'
                            : 'bg-gray-400'
                        }`}></div>
                        <div>
                        <p className="text-sm font-medium text-gray-900">
                            {record.accion}
                        </p>
                        <p className="text-xs text-gray-600">
                            {record.entidadTipo} {record.entidadId} por {record.usuario}
                        </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">
                        {new Date(record.fechaEvento).toLocaleDateString('es-MX')}
                        </p>
                        <p className="text-xs text-gray-500">
                        {new Date(record.fechaEvento).toLocaleTimeString('es-MX')}
                        </p>
                    </div>
                    </div>
                ))}
                
                {recentRecords.length > 10 && (
                    <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Ver toda la actividad →
                    </button>
                    </div>
                )}
                </div>
            )}
            </div>
        </div>

        {/* Modal de reportes */}
        {/* {showReportModal && (
            <ReportModal
            type={reportType}
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSubmit={handleSubmitReport}
            isLoading={
                generateOrderReport.isLoading || 
                generateProductReport.isLoading || 
                generateUserReport.isLoading
            }
            />
        )} */}
        </div>
    );
};
