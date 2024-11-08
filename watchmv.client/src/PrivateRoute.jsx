import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user); // Se establece en true si hay un usuario, false si no.
        });

        return () => unsubscribe();
    }, [auth]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // O un componente de carga si lo prefieres
    }

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
