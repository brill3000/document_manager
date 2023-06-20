import React from 'react';
import { Navigate } from 'react-router-dom';
import { isNull, isUndefined } from 'lodash';
import { useIsAuthenticatedQuery } from 'store/async/dms/auth/authApi';

function ProtectedRoutes({ children }) {
    const { data, error, isSuccess } = useIsAuthenticatedQuery({});
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    React.useEffect(() => {
        if (!isNull(data) && !isUndefined(data)) {
            setIsAuthenticated(data);
        } else if (error && error.data.includes('Invalid token')) {
            setIsAuthenticated(false);
        }
    }, [data, error]);
    return !isNull(isAuthenticated) && isAuthenticated === false && !isUndefined(error) && isSuccess ? <Navigate to="/login" /> : children;
}

export default ProtectedRoutes;
