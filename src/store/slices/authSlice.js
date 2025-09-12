
import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

const initialState = {
    user: authService.getUser(),
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            
            // Guardar en localStorage
            localStorage.setItem('authToken', action.payload.accessToken);
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
            
            // Limpiar localStorage
            authService.logout();
        },
        
        clearError: (state) => {
            state.error = null;
        },
        
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
    updateUser
} = authSlice.actions;

export default authSlice.reducer;