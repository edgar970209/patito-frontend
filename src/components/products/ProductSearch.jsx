import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailability, useProduct } from '../../hooks/useProducts';
import { addNotification } from '../../store/slices/uiSlice';
import { addItemToOrder, removeItemFromOrder, updateItemQuantity } from '../../store/slices/orderSlice';
import { AlertCircle, Minus, Package, Plus, Search, ShoppingCart } from 'lucide-react';




export const ProductSearch = ({ tiendaId }) => {
    const dispatch = useDispatch();
    const currentOrder = useSelector((state) => state.order.currentOrder);
    console.log(currentOrder);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHawa, setSelectedHawa] = useState([]);
    const [quantities, setQuantities] = useState({});

    // Hooks para búsqueda de productos
    const { data: searchResults = [], isLoading: isSearching } = useAvailability(
        searchTerm, 
        tiendaId
    );
    
    const { data: selectedProduct, isLoading: isLoadingProduct } = useProduct(
        selectedHawa
    );
    
    console.log(selectedProduct);
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleProductSelect = (hawa) => {
        setSelectedHawa(hawa);
        setSearchTerm('');
    };

    const handleAddToOrder = (product) => {
        const quantity = quantities[product.hawaId] || 1;
        
        if (quantity <= 0) {
            dispatch(addNotification({
                type: 'warning',
                message: 'La cantidad debe ser mayor a 0'
            }));
            return;
        }

        if (quantity > product.stockQuantity) {
            dispatch(addNotification({
                type: 'error',
                message: `Solo hay ${product.stockQuantity} unidades disponibles`
            }));
            return;
        }

        const orderItem = {
            hawa: product.hawaId,
            nombre: product.productName,
            descripcion: product.descripcion,
            precioLista: product.listPrice,
            descuento: product.discount || 0,
            cantidad: quantity,
            existencias: product.stockQuantity,
            subtotal: product.listPrice * quantity * (1 - (product.discount || 0) / 100)
        };

        dispatch(addItemToOrder(orderItem));
        dispatch(addNotification({
            type: 'success',
            message: `${product.nombre} agregado al pedido`
        }));

        // Limpiar campos
        setQuantities(prev => ({ ...prev, [product.hawaId]: 1 }));
        setSelectedHawa('');
    };

    const handleQuantityChange = (hawa, newQuantity) => {
        if (newQuantity >= 0) {
        setQuantities(prev => ({ ...prev, [hawa]: newQuantity }));
        }
    };

    const handleUpdateOrderQuantity = (hawa, newQuantity) => {
        if (newQuantity > 0) {
        dispatch(updateItemQuantity({ hawa, cantidad: newQuantity }));
        } else {
        dispatch(removeItemFromOrder(hawa));
        }
    };

    // const getItemInOrder = (hawa) => {
    //     return currentOrder.items.find(item => item.hawa === hawa);
    // };


    return (
    <div className="space-y-6">
        {/* Búsqueda de productos */}
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar productos por nombre o descripción..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Búsqueda por HAWA */}
            <div className="relative">
                <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="O buscar por código HAWA..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedHawa}
                    onChange={(e) => setSelectedHawa(e.target.value)}
                />
            </div>
        </div>

        {/* Resultados de búsqueda */}
        {searchTerm && (
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-900">Resultados de búsqueda</h3>
                </div>
                <div className="p-4">
                    {isSearching ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Buscando productos...</p>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">
                            No se encontraron productos con ese término
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {searchResults.map((product) => (
                            <div
                                key={product.hawa}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleProductSelect(product.hawaId)}
                            >
                                <div>
                                    <p className="font-medium">{product.productName}</p>
                                    <p className="text-sm text-gray-600">HAWA: {product.hawaId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${product.precioLista?.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">
                                        Stock: {product.existencias}
                                    </p>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Producto seleccionado */}
        {selectedHawa && (
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-900">Producto Seleccionado</h3>
                </div>
                <div className="p-4">
                    {isLoadingProduct ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Cargando producto...</p>
                        </div>
                    ) : selectedProduct ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-lg">{selectedProduct.productName}</h4>
                                <p className="text-gray-600 text-sm mt-1">{selectedProduct.descripcion}</p>
                                <p className="text-sm text-gray-500 mt-2">HAWA: {selectedProduct.hawaId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                ${selectedProduct.listPrice?.toLocaleString()}
                                </p>
                                {selectedProduct.discount > 0 && (
                                <p className="text-green-600 text-sm">
                                    Descuento: {selectedProduct.discount}%
                                </p>
                                )}
                                <p className={`text-sm mt-1 ${
                                    selectedProduct.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {selectedProduct.stockQuantity > 0 
                                        ? `${selectedProduct.stockQuantity} disponibles`
                                        : 'Sin stock'
                                    }
                                </p>
                            </div>
                            </div>

                            {selectedProduct.available  ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(
                                                    selectedProduct.hawaId, 
                                                    (quantities[selectedProduct.hawaId] || 1) - 1
                                                )}
                                                className="p-1 text-gray-600 hover:text-gray-800"
                                                disabled={(quantities[selectedProduct.hawaId] || 1) <= 1}
                                                >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={selectedProduct.availableQuantity}
                                                value={quantities[selectedProduct.hawaId] || 1}
                                                onChange={(e) => handleQuantityChange(
                                                    selectedProduct.hawaId, 
                                                    parseInt(e.target.value) || 1
                                                )}
                                                className="w-16 text-center border-0 focus:ring-0"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(
                                                    selectedProduct.hawaId, 
                                                    (quantities[selectedProduct.hawaId] || 1) + 1
                                                )}
                                                className="p-1 text-gray-600 hover:text-gray-800"
                                                disabled={(quantities[selectedProduct.hawaId] || 1) >= selectedProduct.availableQuantity}
                                                >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAddToOrder(selectedProduct)}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Agregar al Pedido
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <p className="text-red-700">
                                        Este producto no está disponible en inventario
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                    <div className="text-center py-4">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Producto no encontrado</p>
                    </div>
                    )}
                </div>
            </div>
        )}

        {/* Carrito actual */}
        {currentOrder.items.length > 0 && (
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-900">
                    Productos en el Pedido ({currentOrder.items.length})
                    </h3>
                </div>
                <div className="p-4">
                    <div className="space-y-4">
                        {currentOrder.items.map((item) => (
                            <div key={item.hawa} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.nombre}</h4>
                                    <p className="text-sm text-gray-600">HAWA: {item.hawa}</p>
                                    <p className="text-sm text-gray-600">
                                    ${item.precioLista?.toLocaleString()} 
                                    {item.descuento > 0 && (
                                        <span className="text-green-600 ml-1">
                                        (-{item.descuento}%)
                                        </span>
                                    )}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateOrderQuantity(item.hawa, item.cantidad - 1)}
                                            className="p-1 text-gray-600 hover:text-gray-800"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-3 py-1 text-center min-w-[3rem]">
                                            {item.cantidad}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateOrderQuantity(item.hawa, item.cantidad + 1)}
                                            className="p-1 text-gray-600 hover:text-gray-800"
                                            disabled={item.cantidad >= item.existencias}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                        <p className="font-medium">
                                            ${item.subtotal?.toLocaleString()}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => dispatch(removeItemFromOrder(item.hawa))}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-blue-600">
                            ${currentOrder.total?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {currentOrder.items.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                    No hay productos agregados al pedido
                </p>
                <p className="text-gray-500 text-sm mt-1">
                    Busca y selecciona productos para agregarlos
                </p>
            </div>
        )}
        </div>
    );
}