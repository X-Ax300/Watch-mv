import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../ComponentsCSS/CarteleraDetail.css';
import { IoPerson } from 'react-icons/io5';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import LOGOPRIN1 from '../../assets/logo1.png';
import PurchaseModal from '../../PurchaseModal';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

function EnCarteleraDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [actors, setActors] = useState([]);
    const [trailer, setTrailer] = useState('');
    const [currentActorIndex, setCurrentActorIndex] = useState(0);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => setMovie(data));

        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => setActors(data.cast));

        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => {
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                setTrailer(trailer ? `https://www.youtube.com/embed/${trailer.key}` : '');
            });
    }, [id]);

    const handleNextActor = () => {
        setCurrentActorIndex((prevIndex) => (prevIndex + 4) % actors.length);
    };

    const handlePrevActor = () => {
        setCurrentActorIndex((prevIndex) => (prevIndex - 4 + actors.length) % actors.length);
    };

    // Navigate to actor details page on click
    const handleActorClick = (actorId) => {
        navigate(`/GentePopulares/${actorId}`); // Navigate to the actor's details page
    };

    const handleFavorite = () => {
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

    const handleWatchlist = () => {
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

    const handleRate = () => {
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

    const handlePurchaseClick = () => {
        setShowPurchaseModal(true);
    };

    return (
        <div className="container-encartelera-detail">
            <div className="header-encartelera-detail">
                <button className="back-button-encartelera-detail" onClick={() => navigate('/EnCartelera')}>Back to Cartelera</button>
                <img src={LOGOPRIN1} alt="Logo" className="logo-encartelera-detail" />
                <div className="perfil-icon-encartelera-detail" onClick={() => navigate('/Perfil')} style={{ cursor: 'pointer' }}>
                    <IoPerson />
                </div>
            </div>
            {movie ? (
                <>
                    <div className="movie-header-encartelera-detail">
                        <img
                            className="movie-poster-encartelera-detail"
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <div className="movie-info-encartelera-detail">
                            <h1>{movie.title}</h1>
                            <p>{movie.overview}</p>
                        </div>
                    </div>

                    <div className="movie-full-encartelera-detail">
                        <iframe
                            src="https://player.vimeo.com/video/[YOUR_VIDEO_ID]"
                            width="920" height="650"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            title="Movie Full"
                        ></iframe>
                    </div>

                    <h2 className="actors-title-encartelera-detail">Actors</h2>
                    <div className="carousel-container-encartelera-detail">
                        <button className="carousel-button-encartelera-detail left" onClick={handlePrevActor}>
                            <FaArrowLeft />
                        </button>
                        <div className="carousel-encartelera-detail">
                            {actors.slice(currentActorIndex, currentActorIndex + 4).map(actor => (
                                <div
                                    key={actor.cast_id}
                                    className="actor-item-encartelera-detail"
                                    onClick={() => handleActorClick(actor.id)} // Navigate to actor details on click
                                    style={{ cursor: 'pointer' }} // Add cursor pointer
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                        alt={actor.name}
                                    />
                                    <p>{actor.name} as {actor.character}</p>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-button-encartelera-detail right" onClick={handleNextActor}>
                            <FaArrowRight />
                        </button>
                    </div>
                    {trailer && (
                        <div className="trailer-encartelera-detail">
                            <iframe
                                src={trailer}
                                title="Movie Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    {notification && <div className="notification-encartelera-detail">{notification}</div>}
                    {showPurchaseModal && (
                        <PurchaseModal
                            isOpen={showPurchaseModal}
                            onRequestClose={() => setShowPurchaseModal(false)}
                            movie={movie}
                            onPurchase={completePurchase}
                        />
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default EnCarteleraDetails;
