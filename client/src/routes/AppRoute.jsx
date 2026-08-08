import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from '../hooks/useAuth'
import Loading from "../pages/Loading";

const AppRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading/>;
    }

    return user ? <Navigate to="/dashboard" replace /> : children;
};

export default AppRoute;