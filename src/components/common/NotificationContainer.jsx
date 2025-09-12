import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../../store/slices/uiSlice';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';



export const NotificationContainer = () => {
    const notifications = useSelector( state => state.ui.notifications);
    const dispatch = useDispatch();

    const getNotificationIcon = (type) => {
        switch (type) {
        case 'success':
            return <CheckCircle className="w-5 h-5 text-green-400" />;
        case 'error':
            return <AlertCircle className="w-5 h-5 text-red-400" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
        default:
            return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getNotificationStyles = (type) => {
        switch (type) {
        case 'success':
            return 'bg-green-50 border-green-200 text-green-800';
        case 'error':
            return 'bg-red-50 border-red-200 text-red-800';
        case 'warning':
            return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default:
            return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={() => dispatch(removeNotification(notification.id))}
                    getIcon={getNotificationIcon}
                    getStyles={getNotificationStyles}
                />
            ))}
        </div>
    );
}

const NotificationItem = ({ notification, onRemove, getIcon, getStyles }) => {
    // const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove();
        }, notification.duration);

        return () => clearTimeout(timer);
    }, [notification.id, notification.duration, onRemove]);

    return (
        <div className={`max-w-sm w-full border rounded-lg shadow-lg p-4 animate-slide-in ${getStyles(notification.type)}`}>
        <div className="flex items-start">
            <div className="flex-shrink-0">
            {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
                {notification.message}
            </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
            <button
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onRemove}
            >
                <X className="w-4 h-4" />
            </button>
            </div>
        </div>
        </div>
    );
};
