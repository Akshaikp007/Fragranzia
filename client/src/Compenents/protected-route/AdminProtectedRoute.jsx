import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AdminProtectedRoute = () => {
    const location = useLocation();
    const { auth } = useAuth();

    if (!auth?.accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (auth?.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
