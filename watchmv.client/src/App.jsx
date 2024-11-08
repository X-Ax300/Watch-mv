import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';
import Loader from './Loader';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3780); // Hide loader after ~3.8 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return <RouterProvider router={router} />;
}

export default App;
