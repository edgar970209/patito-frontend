import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    isLoading: false,
    notifications: [],
    modals: {
        productSearch: false,
        orderConfirmation: false
    },
    searchQuery: '',
    filters: {
        estatus: 'todos',
        fechaInicio: null,
        fechaFin: null
    }
}


const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        addNotification: (state, action) => {
            const notification = {
                id: Date.now(),
                type: action.payload.type || 'info',
                message: action.payload.message,
                duration: action.payload.duration || 5000
            };
            state.notifications.push(notification);
        },
        
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
        
        toggleModal: (state, action) => {
            const { modalName, isOpen } = action.payload;
            state.modals[modalName] = isOpen;
        },
        
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        
        resetFilters: (state) => {
            state.filters = initialState.filters;
        }
    }
});

export const {
    setLoading,
    addNotification,
    removeNotification,
    toggleModal,
    setSearchQuery,
    updateFilters,
    resetFilters
} = uiSlice.actions;

export default uiSlice.reducer;