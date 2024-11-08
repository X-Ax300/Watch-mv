import React, { useEffect, useState } from 'react';
import MovieItem from './MovieItem';
import './Movie.css';

function Movie({ onMovieClick }) {
    const [movieList, setMovieList] = useState([]);
    const [visibleMovies, setVisibleMovies] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [notification, setNotification] = useState('');
    const moviesPerPage = 5;
    const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
    const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

    const getMovie = (page) => {
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`)
            .then(res => res.json())
            .then(json => {
                setMovieList(prevMovieList => [...prevMovieList, ...json.results]);
                setHasMore(json.page < json.total_pages);
            })
            .catch(error => console.error('Error fetching movies:', error));
    };

    useEffect(() => {
        getMovie(page);
    }, [page]);

    const handleNext = () => {
        if (visibleMovies + moviesPerPage >= movieList.length && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
        setVisibleMovies(prevVisibleMovies => prevVisibleMovies + moviesPerPage);
    };

    const handlePrev = () => {
        setVisibleMovies(prevVisibleMovies => Math.max(0, prevVisibleMovies - moviesPerPage));
    };

    const handleFavorite = (movie) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: movie.id,
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

    const handleWatchlist = (movie) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/watchlist?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: movie.id,
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

    const handleRate = (movie) => {
        const rating = prompt('Rate this movie (0.5 - 10.0):');
        if (rating) {
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/rating?api_key=${apiKey}&session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: parseFloat(rating) })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setNotification('Rated movie!');
                    } else {
                        setNotification(`Error: ${data.status_message}`);
                    }
                    setTimeout(() => setNotification(''), 3000);
                })
                .catch(error => console.error('Error rating movie:', error));
        }
    };

    const completePurchase = (movie) => {
        const purchasedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
        purchasedMovies.push(movie);
        localStorage.setItem('purchasedMovies', JSON.stringify(purchasedMovies));
        setNotification('Purchase successful!');
        setTimeout(() => setNotification(''), 3000);
    };

    return (
        <div>
            {notification && <div className="notification">{notification}</div>}
            <div className="movie-container">
                {movieList.slice(visibleMovies, visibleMovies + moviesPerPage).map((movie) => (
                    <MovieItem
                        key={movie.id}
                        movie={movie}
                        onFavorite={handleFavorite}
                        onWatchlist={handleWatchlist}
                        onRate={handleRate}
                        onPurchase={completePurchase}
                        onClick={() => onMovieClick(movie.id)}
                    />
                ))}
            </div>
            <div className="button-container">
                <button onClick={handlePrev} className="prev-button" disabled={visibleMovies === 0}>Previous</button>
                <button onClick={handleNext} className="next-button" disabled={!hasMore && visibleMovies + moviesPerPage >= movieList.length}>Next</button>
            </div>
        </div>
    );
}

export default Movie;
