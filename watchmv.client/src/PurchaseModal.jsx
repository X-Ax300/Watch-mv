import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './ComponentsCSS/PurchaseModal.css';
import LOGOPRIN from './assets/logoWMV.png';

Modal.setAppElement('#root');

function PurchaseModal({ isOpen, onRequestClose, isSubscription, onSubscribe }) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [paymentError, setPaymentError] = useState(''); // Estado para manejar errores de pago

    useEffect(() => {
        const loadPayPalScript = () => {
            // Remove existing script before adding a new one
            const existingScript = document.querySelector(
                'script[src="https://www.paypal.com/sdk/js?client-id=AfRREaEsLwANQb3cZ8nDM37Ogtw07a1AUus9q4Yo3OBWa2y2wlZ248m6tDuaMz2hLkvKiYzVPva7OVhO"]'
            );
            if (existingScript) existingScript.remove();

            // Load PayPal script
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=AfRREaEsLwANQb3cZ8nDM37Ogtw07a1AUus9q4Yo3OBWa2y2wlZ248m6tDuaMz2hLkvKiYzVPva7OVhO'; // Reemplaza con tu client ID de PayPal
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.onerror = () => setPaymentError('Failed to load PayPal script. Please try again later.');
            document.body.appendChild(script);
        };

        if (isOpen) {
            loadPayPalScript();
        } else {
            setScriptLoaded(false); // Reset the script loaded state
            setPaymentError(''); // Reset any previous errors
        }

        return () => {
            // Clean up script when modal is closed or component unmounts
            const existingScript = document.querySelector(
                'script[src="https://www.paypal.com/sdk/js?client-id=AfRREaEsLwANQb3cZ8nDM37Ogtw07a1AUus9q4Yo3OBWa2y2wlZ248m6tDuaMz2hLkvKiYzVPva7OVhO"]'
            );
            if (existingScript) existingScript.remove();
        };
    }, [isOpen]);

    useEffect(() => {
        if (scriptLoaded && window.paypal && isOpen) {
            // Asegúrate de que el contenedor este en el DOM antes de renderizar el boton
            const container = document.getElementById('paypal-button-container');
            if (container) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    currency_code: 'USD',
                                    value: isSubscription ? '4.99' : '12.99'
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            if (isSubscription) {
                                onSubscribe(); // Llama a la funcion de suscripcion si es una suscripcion
                            }
                            onRequestClose();
                        }).catch(err => {
                            setPaymentError('Failed to process payment. Please try again.');
                        });
                    },
                    onError: (err) => {
                        setPaymentError('An error occurred during the transaction. Please try again.');
                    }
                }).render('#paypal-button-container').catch(() => {
                    setPaymentError('Failed to render PayPal button. Please try again later.');
                });
            }
        }
    }, [scriptLoaded, isSubscription, onSubscribe, onRequestClose, isOpen]);

    const handleCloseModal = () => {
        setPaymentError(''); // Reset error state
        onRequestClose(); // Close modal
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            contentLabel={isSubscription ? "Subscribe to Watch.MV" : "Purchase Movie"}
            className="modal"
            overlayClassName="overlay"
        >
            <div className='modal-header'>
                <img src={LOGOPRIN} alt='Logo' className='logo' />
                <h2>{isSubscription ? "Subscribe to Watch.MV" : "Purchase Movie"}</h2>
            </div>
            <div className='modal-body'>
                {paymentError && <p className="payment-error">{paymentError}</p>}
                {scriptLoaded ? (
                    <div id="paypal-button-container"></div>
                ) : (
                    <p>Loading payment options...</p>
                )}
            </div>
            <div className='modal-footer'>
                <button onClick={handleCloseModal}>Cancel</button>
            </div>
        </Modal>
    );
}

export default PurchaseModal;
