import React, { useState, useEffect } from 'react';
import './Loader.css';
import logoAnimation from './assets/Logoanimationloadedopage.gif';

const Loader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
        }, 3500); // Start fade-out after 3.5 seconds

        const fadeOutTimer = setTimeout(() => {
            setIsVisible(false);
        }, 5000); // Complete fade-out after 5 seconds

        return () => {
            clearTimeout(timer);
            clearTimeout(fadeOutTimer);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`loader ${isFading ? 'fade-out' : ''}`}>
            <img src={logoAnimation} alt="Loading..." />
        </div>
    );
};

export default Loader;
