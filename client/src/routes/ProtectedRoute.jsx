import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from '../hooks/useAuth'
import Loading from "../pages/Loading";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading/>;
    }

    return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;