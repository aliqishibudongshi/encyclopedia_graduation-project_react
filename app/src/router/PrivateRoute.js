import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLastRoute } from '../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const isRehydrated = useSelector((state) => state._persist?.rehydrated); // Safely access _persist
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(setLastRoute(location.pathname));
        }
    }, [isLoggedIn, location.pathname, dispatch]);

    // Wait for rehydration before rendering
    if (isRehydrated === false) return null; // Optional: Add a loading spinner here

    return isLoggedIn ? children || <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
