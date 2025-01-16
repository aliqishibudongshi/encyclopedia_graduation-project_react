import Login from "../views/Login";
import Register from "../views/Register";
import ForgotPassword from "../views/ForgotPassword";
import Dashboard from "../views/Dashboard";
import Illustration from "../views/Dashboard/Illustrations";
import Community from "../views/Dashboard/Community";
import Profile from "../views/Dashboard/Profile";
import ResetPassword from "../views/ResetPassword";

export const publicRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> },
];

export const privateRoutes = [
    {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
            { path: 'illustrations', element: <Illustration /> }, // Notice no leading slash
            { path: 'community', element: <Community /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
];