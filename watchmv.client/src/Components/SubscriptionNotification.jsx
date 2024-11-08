// src/Components/SubscriptionNotification.jsx

import React from 'react';
import '../ComponentsCSS/SubscriptionNotification.css'; // Import the CSS file for styling

const SubscriptionNotification = ({ onConfirm, onClose }) => {
    return (
        <div className="notification-overlay">
            <div className="notification-content">
                <h2 className="notification-title">Special Offer!</h2>
                <p className="notification-message">
                    Todavia estamos en mejoras. Si te suscribes ahora, tendras 3 meses gratis, pero se te cobrara 4.99 dolares despues. Deseas continuar?
                </p>
                <div className="notification-buttons">
                    <button className="btn confirm-btn" onClick={onConfirm}>
                        OK
                    </button>
                    <button className="btn cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionNotification;
