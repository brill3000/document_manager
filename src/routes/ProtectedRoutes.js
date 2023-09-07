import React from 'react';
import { Navigate } from 'react-router-dom';
import { isNull, isUndefined } from 'lodash';

function ProtectedRoutes({ children }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    return !isNull(isAuthenticated) && isAuthenticated === false && !isUndefined(error) && isSuccess ? <Navigate to="/login" /> : children;
}

export default ProtectedRoutes;
