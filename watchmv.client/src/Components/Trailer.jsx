import React, { useEffect, useState } from 'react';
import TrailerItem from './TrailerItem';
import './trailer.css';
import { useNavigate } from 'react-router-dom';

function Trailer() {
    const [trailerList, setTrailerList] = useState([]);
    const [visibleTrailers, setVisibleTrailers] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [notification, setNotification] = useState('');
    const trailersPerPage = 5;
    const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
    const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';
    const navigate = useNavigate();

    const getTrailers = (page) => {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`)
            .then(res => res.json())
            .then(json => {
                setTrailerList(prevTrailerList => [...prevTrailerList, ...json.results]);
                setHasMore(json.page < json.total_pages);
            })
            .catch(error => console.error('Error fetching trailers:', error));
    };

    useEffect(() => {
        getTrailers(page);
    }, [page]);

    const handleNext = () => {
        if (visibleTrailers + trailersPerPage >= trailerList.length && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
        setVisibleTrailers(prevVisibleTrailers => prevVisibleTrailers + trailersPerPage);
    };

    const handlePrev = () => {
        setVisibleTrailers(prevVisibleTrailers => Math.max(0, prevVisibleTrailers - trailersPerPage));
    };

    const handleFavorite = (trailer) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: trailer.id,
                favorite: true
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setNotification('Added to favorites!');
                } else {
                    setNotification(`Error: ${data.status_message}`);
                }
                setTimeout(() => setNotification(''), 3000);
            })
            .catch(error => console.error('Error adding to favorites:', error));
    };

    const handleWatchlist = (trailer) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/watchlist?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: trailer.id,
                watchlist: true
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setNotification('Added to watchlist!');
                } else {
                    setNotification(`Error: ${data.status_message}`);
                }
                setTimeout(() => setNotification(''), 3000);
            })
            .catch(error => console.error('Error adding to watchlist:', error));
    };

    const handleRate = (trailer) => {
        const rating = prompt('Rate this trailer (0.5 - 10.0):');
        if (rating) {
            fetch(`https://api.themoviedb.org/3/movie/${trailer.id}/rating?api_key=${apiKey}&session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: parseFloat(rating) })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setNotification('Rated trailer!');
                    } else {
                        setNotification(`Error: ${data.status_message}`);
                    }
                    setTimeout(() => setNotification(''), 3000);
                })
                .catch(error => console.error('Error rating trailer:', error));
        }
    };

    const completePurchase = (trailer) => {
        const purchasedTrailers = JSON.parse(localStorage.getItem('purchasedTrailers')) || [];
        purchasedTrailers.push(trailer);
        localStorage.setItem('purchasedTrailers', JSON.stringify(purchasedTrailers));
        setNotification('Purchase successful!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handleTrailerClick = (trailerId) => {
        navigate(`/movie/${trailerId}`);
    };

    return (
        <div>
            {notification && <div className="notification">{notification}</div>}
            <div className="movie-container">
                {trailerList.slice(visibleTrailers, visibleTrailers + trailersPerPage).map((trailer) => (
                    <TrailerItem
                        key={trailer.id}
                        trailer={trailer}
                        onFavorite={handleFavorite}
                        onWatchlist={handleWatchlist}
                        onRate={handleRate}
                        onPurchase={completePurchase}
                        onClick={() => handleTrailerClick(trailer.id)}
                    />
                ))}
            </div>
            <div className="button-container">
                <button onClick={handlePrev} className="prev-button" disabled={visibleTrailers === 0}>Previous</button>
                <button onClick={handleNext} className="next-button" disabled={!hasMore && visibleTrailers + trailersPerPage >= trailerList.length}>Next</button>
            </div>
        </div>
    );
}

export default Trailer;
