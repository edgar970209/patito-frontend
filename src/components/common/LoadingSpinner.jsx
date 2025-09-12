


export const LoadingSpinner = ({ size = 'default', message = 'Cargando...' }) => {

    const sizeClasses = {
        small: 'w-4 h-4',
        default: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
            {message && (
                <p className="mt-4 text-gray-600 text-center">{message}</p>
            )}
        </div>
    );
}