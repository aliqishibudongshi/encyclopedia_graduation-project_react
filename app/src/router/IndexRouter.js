import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import { publicRoutes, privateRoutes } from './routesConfig';

const renderRoutes = (routes) =>
    routes.map((route) => (
        <Route
            key={route.path}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
        >
            {route.children && renderRoutes(route.children)}
        </Route>
    ));

const IndexRouter = () => {
    const { isLoggedIn, lastRoute } = useSelector((state) => state.auth);

    return (
        <Routes>
            {/* Default Route */}
            <Route
                path="/"
                element={<Navigate to={isLoggedIn ? lastRoute || '/dashboard/illustrations' : '/login'} />}
            />

            {/* Public Routes */}
            {publicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Private Routes */}
            {renderRoutes(privateRoutes)}

            {/* No permission */}
            <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
    );
};

export default IndexRouter;