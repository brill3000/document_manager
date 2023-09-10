import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isNull, isUndefined } from 'lodash';

// Function to get the value of a specific cookie by name
function getCookie(cookieName: string) {
    // Split the cookie string into an array of individual cookies
    const cookies = document.cookie.split(';');

    // Loop through the cookies to find the one with the specified name
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Remove leading and trailing spaces
        // Check if this cookie starts with the specified name
        if (cookie.startsWith(cookieName + '=')) {
            // Extract and return the cookie value
            return cookie.substring(cookieName.length + 1);
        }
    }

    // If the cookie is not found, return null or an appropriate default value
    return null;
}
function ProtectedRoutes({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    console.log(document.cookie, 'COOKIE');
    console.log(getCookie('token'), 'COOKIE');
    return !isNull(isAuthenticated) && isAuthenticated === false ? <Navigate to="/login" /> : children;
}

export default ProtectedRoutes;
