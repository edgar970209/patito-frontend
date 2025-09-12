
import { useState } from 'react';
import { 
    Plus, 
    Search, 
    Package, 
    AlertTriangle, 
    TrendingUp, 
    TrendingDown,
    Edit,
    Trash2,
    Filter
} from 'lucide-react';
import { 
    useProducts, 
    useCreateProduct,
    useIncrementStock,
    useDecrementStock,
    useDeleteByHawa,
    useLowStack,
    useOutOfStock,
    useUpdateProductStatus
} from '../hooks/useProducts';
import {LoadingSpinner} from '../components/common/LoadingSpinner';
import {StatusBadge} from '../components/common/StatusBadge';
import {ProductModal} from '../components/products/ProductModal';
import {StockAdjustmentModal} from '../components/products/StockAdjustmentModal';

export const InventoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockAction, setStockAction] = useState('increment'); // 'increment' | 'decrement'
    const [filter, setFilter] = useState('all'); // 'all' | 'low-stock' | 'out-of-stock'

    // Hooks
    const { data: products = [], isLoading } = useProducts();
    const { data: lowStockProducts = [] } = useLowStack();
    const { data: outOfStockProducts = [] } = useOutOfStock();
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProductStatus();
    const deleteProductMutation = useDeleteByHawa();
    const incrementStockMutation = useIncrementStock();
    const decrementStockMutation = useDecrementStock();

    if (isLoading) return <LoadingSpinner message="Cargando inventario..." />;
    // Filtrar productos
    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.hawaId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = () => {
        switch (filter) {
            case 'low-stock':
            return lowStockProducts.some(p => p.hawaId === product.hawaId);
            case 'out-of-stock':
            return outOfStockProducts.some(p => p.hawaId === product.hawaId);
            default:
            return true;
        }
        };

        return matchesSearch && matchesFilter();
    });

    // Estadísticas
    const stats = {
        total: products.length,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        totalValue: products.reduce((sum, p) => sum + (p.listPrice * p.stockQuantity), 0)
    };

    const handleCreateProduct = () => {
        setSelectedProduct(null);
        setShowProductModal(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (hawa) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        await deleteProductMutation.mutateAsync(hawa);
        }
    };

    const handleStockAdjustment = (product, action) => {
        setSelectedProduct(product);
        setStockAction(action);
        setShowStockModal(true);
    };

    const getStockStatus = (product) => {
        if (outOfStockProducts.some(p => p.hawaId === product.hawaId)) {
        return { status: 'out-of-stock', label: 'Agotado', color: 'text-red-600 bg-red-100' };
        }
        if (lowStockProducts.some(p => p.hawaId === product.hawaId)) {
        return { status: 'low-stock', label: 'Bajo Stock', color: 'text-yellow-600 bg-yellow-100' };
        }
        return { status: 'in-stock', label: 'En Stock', color: 'text-green-600 bg-green-100' };
    };

    

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
                    <p className="text-gray-600 mt-1">
                        Administra el inventario de productos y controla el stock
                    </p>
                </div>
                <button
                    onClick={handleCreateProduct}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Producto
                </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                { 
                    label: 'Total Productos', 
                    value: stats.total, 
                    icon: Package, 
                    color: 'text-blue-600 bg-blue-100' 
                },
                { 
                    label: 'Bajo Stock', 
                    value: stats.lowStock, 
                    icon: AlertTriangle, 
                    color: 'text-yellow-600 bg-yellow-100' 
                },
                { 
                    label: 'Agotados', 
                    value: stats.outOfStock, 
                    icon: AlertTriangle, 
                    color: 'text-red-600 bg-red-100' 
                },
                { 
                    label: 'Valor Total', 
                    value: `$${stats.totalValue?.toLocaleString()}`, 
                    icon: TrendingUp, 
                    color: 'text-green-600 bg-green-100' 
                }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                                </div>
                                <div className="ml-4">
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
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
                            placeholder="Buscar por HAWA, nombre o descripción..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todos los productos</option>
                                <option value="low-stock">Bajo stock</option>
                                <option value="out-of-stock">Agotados</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de productos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                        {products.length === 0 ? 'No hay productos registrados' : 'No se encontraron productos'}
                    </p>
                </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                HAWA
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product);
                            
                            return (
                                <tr key={product.hawaId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.productName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.descripcion}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                        {product.hawaId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${product.listPrice?.toLocaleString()}
                                        </div>
                                        {product.descuento > 0 && (
                                            <div className="text-sm text-green-600">
                                                Desc: {product.discount}%
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.stockQuantity} unidades
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Valor: ${(product.listPrice * product.stockQuantity)?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                            {stockStatus.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                        >
                                        <Edit className="w-4 h-4 mr-1" />
                                            Editar
                                        </button>
                                        
                                        <button
                                            onClick={() => handleStockAdjustment(product, 'increment')}
                                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                                        >
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            +Stock
                                        </button>
                                        
                                        <button
                                            onClick={() => handleStockAdjustment(product, 'decrement')}
                                            className="text-orange-600 hover:text-orange-900 inline-flex items-center"
                                        >
                                            <TrendingDown className="w-4 h-4 mr-1" />
                                            -Stock
                                        </button>
                                        
                                        <button
                                            onClick={() => handleDeleteProduct(product.hawaId)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                </div>
                )}
            </div>

            {/* Modales */}
            {showProductModal && (
                <ProductModal
                    product={selectedProduct}
                    isOpen={showProductModal}
                    onClose={() => setShowProductModal(false)}
                    onSubmit={selectedProduct ? updateProductMutation.mutateAsync : createProductMutation.mutateAsync}
                    isLoading={selectedProduct ? updateProductMutation.isLoading : createProductMutation.isLoading}
                />
            )}

            {showStockModal && selectedProduct && (
                <StockAdjustmentModal
                    product={selectedProduct}
                    action={stockAction}
                    isOpen={showStockModal}
                    onClose={() => setShowStockModal(false)}
                    onSubmit={(stockAction === 'increment' ? incrementStockMutation.mutateAsync: decrementStockMutation.mutateAsync)}
                    isLoading={stockAction === 'increment' ? incrementStockMutation.isLoading : decrementStockMutation.isLoading}
                />
            )}
        </div>
    );
};