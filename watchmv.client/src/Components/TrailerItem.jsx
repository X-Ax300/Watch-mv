import React, { useState } from 'react';
import RatingCircle from './RatingCircle';
import PurchaseModal from '../PurchaseModal';
import '../ComponentsCSS/MovieItem.css';

function TrailerItem({ trailer, onFavorite, onWatchlist, onRate, onPurchase, onClick }) {
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
        <div className="movie-item" onClick={onClick}>
            <img
                className={`movie-poster ${isBlur ? 'blur' : ''}`}
                src={`https://image.tmdb.org/t/p/w500${trailer.poster_path}`}
                alt={trailer.title}
            />
            <div className="menu-icon" onClick={toggleMenu}>
                ...
            </div>
            {isMenuOpen && (
                <div className="dropdown-menu" onClick={handleMenuClick}>
                    <div className="dropdown-item" onClick={() => onFavorite(trailer)}>Favorite</div>
                    <div className="dropdown-item" onClick={() => onWatchlist(trailer)}>Watchlist</div>
                    <div className="dropdown-item" onClick={() => onRate(trailer)}>Your rating</div>
                    <div className="dropdown-item" onClick={handlePurchase}>Purchase</div>
                </div>
            )}
            <div className="movie-details">
                <div className="rating-wrapper">
                    <RatingCircle rating={trailer.vote_average / 10} />
                </div>
                <h3>{trailer.title}</h3>
                <p>{new Date(trailer.release_date).toLocaleDateString()}</p>
            </div>
            {showPurchaseModal && (
                <PurchaseModal
                    isOpen={showPurchaseModal}
                    onRequestClose={() => setShowPurchaseModal(false)}
                    movie={trailer}
                    onPurchase={onPurchase}
                    stopPropagation // Propagacion detenida para el modal
                />
            )}
        </div>
    );
}

export default TrailerItem;
