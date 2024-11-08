import React, { useState } from 'react';
import RatingCircle from './RatingCircle';
import PurchaseModal from '../PurchaseModal';
import '../ComponentsCSS/MovieItem.css';

function SeriesItem({ series, onFavorite, onWatchlist, onRate, onPurchase, onClick }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBlur, setIsBlur] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const toggleMenu = (e) => {
        e.stopPropagation(); // Evita la propagacion del evento para que no dispare el onClick del contenedor
        setIsMenuOpen(!isMenuOpen);
        setIsBlur(!isBlur);
    };

    const handlePurchase = (e) => {
        e.stopPropagation(); // Evita la propagacion del evento para que no dispare el onClick del contenedor
        setShowPurchaseModal(true);
    };

    const handleMenuClick = (e) => {
        e.stopPropagation(); // Evita la propagacion del evento para que no dispare el onClick del contenedor
    };

    return (
        <div className="series-item" onClick={() => onClick(series.id)}>
            <img
                className={`series-poster ${isBlur ? 'blur' : ''}`}
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
            />
            <div className="menu-icon" onClick={toggleMenu}>
                ...
            </div>
            {isMenuOpen && (
                <div className="dropdown-menu" onClick={handleMenuClick}>
                    <div className="dropdown-item" onClick={() => onFavorite(series)}>Favorite</div>
                    <div className="dropdown-item" onClick={() => onWatchlist(series)}>Watchlist</div>
                    <div className="dropdown-item" onClick={() => onRate(series)}>Your rating</div>
                    <div className="dropdown-item" onClick={handlePurchase}>Purchase</div>
                </div>
            )}
            <div className="series-details">
                <div className="rating-wrapper">
                    <RatingCircle rating={series.vote_average / 10} />
                </div>
                <h3>{series.name}</h3>
                <p>{new Date(series.first_air_date).toLocaleDateString()}</p>
            </div>
            {showPurchaseModal && (
                <PurchaseModal
                    isOpen={showPurchaseModal}
                    onRequestClose={() => setShowPurchaseModal(false)}
                    movie={series}
                    onPurchase={onPurchase}
                    stopPropagation // Propagacion detenida para el modal
                />
            )}
        </div>
    );
}

export default SeriesItem;
