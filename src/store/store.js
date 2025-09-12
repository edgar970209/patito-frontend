import { configureStore } from '@reduxjs/toolkit';
import orderSlice from './slices/orderSlice';
import uiSlice from './slices/uiSlice';
import authSlice from './slices/authSlice';




export const store = configureStore({
    reducer: {
        // Aquí van los reducers
        order: orderSlice,
        ui: uiSlice,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        })
});