import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    currentOrder: {
        items: [],
        customer: {
            nombre: '',
            email: '',
            telefono: '',
            direccion: '',
        },
        vendedor: '',
        tienda: '',
        descuentoGeneral: 0,
        total: 0,
    }, 
    orders: [],
    loading: false,
    error: null,
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addItemToOrder: (state, action) => {
            const existingItem = state.currentOrder.items.find(item => item.hawa === action.payload.hawa);

            if( existingItem ) {
                existingItem.cantidad += action.payload.cantidad;
            } else {
                state.currentOrder.items.push(action.payload);
            }


            // Recalcular el total
            state.currentOrder.total = state.currentOrder.items.reduce(( total, item ) => 
                total + (item.precioLista * item.cantidad * (1 - (item.descuento || 0) / 100)), 0
            );
        },

        removeItemFromOrder: (state, action) => {
            state.currentOrder.items = state.currentOrder.items.filter( item => item.hawa !== action.payload);

            // Recalcular total
            state.currentOrder.total = state.currentOrder.items.reduce(
                (total, item) => total + (item.precioLista * item.cantidad * (1 - item.descuento / 100)),
                0
            );
        },

        updateItemQuantity: (state, action) => {
            const { hawa, cantidad } = action.payload;
            const item = state.currentOrder.items.find(item => item.hawa === hawa);
            
            if (item && cantidad > 0) {
                item.cantidad = cantidad;
            }
            
            // Recalcular total
            state.currentOrder.total = state.currentOrder.items.reduce(
                (total, item) => total + (item.precioLista * item.cantidad * (1 - item.descuento / 100)),
                0
            );
        },
        
        updateCustomerInfo: (state, action) => {
            state.currentOrder.customer = { ...state.currentOrder.customer, ...action.payload };
        },
        
        updateOrderInfo: (state, action) => {
            state.currentOrder = { ...state.currentOrder, ...action.payload };
        },
        
        clearCurrentOrder: (state) => {
            state.currentOrder = initialState.currentOrder;
        },
        
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        
        updateOrderStatus: (state, action) => {
            const { id, estatus } = action.payload;
            const order = state.orders.find(order => order.id === id);
            if (order) {
                order.estatus = estatus;
            }
            },
            
            setLoading: (state, action) => {
            state.loading = action.payload;
            },
            
            setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    updateCustomerInfo,
    updateOrderInfo,
    clearCurrentOrder,
    setOrders,
    updateOrderStatus,
    setLoading,
    setError
} = orderSlice.actions;

export default orderSlice.reducer;