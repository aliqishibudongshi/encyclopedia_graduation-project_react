import {useEffect}from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLastRoute } from '../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(setLastRoute(location.pathname));
        }
    }, [isLoggedIn, location.pathname, dispatch]);

    return isLoggedIn ? (
        children || <Outlet />
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;