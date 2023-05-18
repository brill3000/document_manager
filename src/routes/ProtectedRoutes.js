import { useUserAuth } from 'context/authContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({ children }) {
    const { user } = useUserAuth();
    if (!user) return <Navigate to="/login" />;
    else return children;
}

export default ProtectedRoutes;
