import React, { useEffect } from "react";
import UserLayout from "../layout/UserLayout";
import { Navigate, Outlet, useLocation  } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const UserProtectedRoute = () => {
    const location = useLocation();
    const { auth } = useAuth();

    if (!auth?.accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (auth?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return (
        <UserLayout>
            <Outlet />
        </UserLayout>
    );
};

export default UserProtectedRoute;