import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    username: null,
    token: null,
    lastRoute: '/dashboard/illustrations', // Default route after login
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.username = action.payload.username;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.username = null;
            state.token = null;
            state.lastRoute = '/dashboard/illustrations'; // Reset to default route
        },
        setLastRoute(state, action) {
            state.lastRoute = action.payload;
        },
    },
});

export const { login, logout, setLastRoute } = authSlice.actions;
export default authSlice.reducer;
