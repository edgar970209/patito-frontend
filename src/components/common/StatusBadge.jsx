import { CheckCircle, Clock, XCircle } from 'lucide-react';



export const StatusBadge = ({ status }) => {

    const getStatusConfig = (status) => {
        switch (status) {
        case 'pendiente':
            return {
            icon: Clock,
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            label: 'Pendiente'
            };
        case 'entregado':
            return {
            icon: CheckCircle,
            className: 'bg-green-100 text-green-800 border-green-200',
            label: 'Entregado'
            };
        case 'cancelado':
            return {
            icon: XCircle,
            className: 'bg-red-100 text-red-800 border-red-200',
            label: 'Cancelado'
            };
        default:
            return {
            icon: Clock,
            className: 'bg-gray-100 text-gray-800 border-gray-200',
            label: status
            };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
        </span>
    );
}