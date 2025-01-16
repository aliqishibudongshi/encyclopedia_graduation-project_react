import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    // You can add middleware here if needed
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Example of adding middleware
        }),
});