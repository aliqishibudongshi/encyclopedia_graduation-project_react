import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    username: localStorage.getItem('username') || null,
    token: localStorage.getItem('token') || null,
    lastRoute: '/dashboard/illustrations',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.username = action.payload.username;
            // Save to localStorage
            localStorage.setItem('isLoggedIn', JSON.stringify(true));
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('token', action.payload.token);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.username = null;
            state.token = null;
            state.lastRoute = '/dashboard/illustrations';
            // Remove from localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('token');
        },
        setLastRoute(state, action) {
            state.lastRoute = action.payload;
        },
    },
});

export const { login, logout, setLastRoute } = authSlice.actions;
export default authSlice.reducer;