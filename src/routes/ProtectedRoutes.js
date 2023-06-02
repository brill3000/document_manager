import React from 'react';
import { Navigate } from 'react-router-dom';
import { isNull, isUndefined } from 'lodash';
import { useIsAuthenticatedQuery } from 'store/async/dms/auth/authApi';

function ProtectedRoutes({ children }) {
    const { data, error } = useIsAuthenticatedQuery({});
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    React.useEffect(() => {
        console.log(error, 'error');
        if (!isNull(data) && !isUndefined(data)) {
            setIsAuthenticated(data);
        } else if (error && error.data.includes('Invalid token')) {
            setIsAuthenticated(false);
        }
    }, [data, error]);
    return !isNull(isAuthenticated) && isAuthenticated === false ? <Navigate to="/login" /> : children;
}

export default ProtectedRoutes;
