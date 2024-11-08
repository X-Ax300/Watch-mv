import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../ComponentsCSS/SeriesPopularesDetails.css';
import { IoPerson } from 'react-icons/io5';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import LOGOPRIN1 from '../../assets/logo1.png';
import PurchaseModal from '../../PurchaseModal';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

function SeriesPopularesDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [series, setSeries] = useState(null);
    const [actors, setActors] = useState([]);
    const [currentActorIndex, setCurrentActorIndex] = useState(0);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchSeriesDetails(id);
        fetchSeriesActors(id);
    }, [id]);

    const fetchSeriesDetails = async (seriesId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=en-US`);
            const data = await response.json();
            setSeries(data);
        } catch (error) {
            console.error('Error fetching series details:', error);
        }
    };

    const fetchSeriesActors = async (seriesId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}&language=en-US`);
            const data = await response.json();
            setActors(data.cast);
        } catch (error) {
            console.error('Error fetching series actors:', error);
        }
    };

    const handleNextActor = () => {
        setCurrentActorIndex((prevIndex) => (prevIndex + 4) % actors.length);
    };

    const handlePrevActor = () => {
        setCurrentActorIndex((prevIndex) => (prevIndex - 4 + actors.length) % actors.length);
    };

    // Handle actor click to navigate to actor details
    const handleActorClick = (actorId) => {
        navigate(`/GentePopulares/${actorId}`); // Navigate to the actor's details page
    };

    const handleFavorite = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/account/21248529/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    media_type: 'tv',
                    media_id: series.id,
                    favorite: true
                })
            });
            const data = await response.json();
            if (data.success) {
                setNotification('Added to favorites!');
            } else {
                setNotification(`Error: ${data.status_message}`);
            }
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const handleWatchlist = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/account/21248529/watchlist?api_key=${apiKey}&session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    media_type: 'tv',
                    media_id: series.id,
                    watchlist: true
                })
            });
            const data = await response.json();
            if (data.success) {
                setNotification('Added to watchlist!');
            } else {
                setNotification(`Error: ${data.status_message}`);
            }
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error adding to watchlist:', error);
        }
    };

    const handleRate = async () => {
        const rating = prompt('Rate this series (0.5 - 10.0):');
        if (rating) {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${series.id}/rating?api_key=${apiKey}&session_id=${sessionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ value: parseFloat(rating) })
                });
                const data = await response.json();
                if (data.success) {
                    setNotification('Rated series!');
                } else {
                    setNotification(`Error: ${data.status_message}`);
                }
                setTimeout(() => setNotification(''), 3000);
            } catch (error) {
                console.error('Error rating series:', error);
            }
        }
    };

    const completePurchase = (series) => {
        const purchasedSeries = JSON.parse(localStorage.getItem('purchasedSeries')) || [];
        purchasedSeries.push(series);
        localStorage.setItem('purchasedSeries', JSON.stringify(purchasedSeries));
        setNotification('Purchase successful!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handlePurchaseClick = () => {
        setShowPurchaseModal(true);
    };

    return (
        <div className="series-detailD">
            <div className="series-headerD">
                <button className="series-back-buttonD" onClick={() => navigate('/SeriesPopulares')}>Back to Popular Series</button>
                <img src={LOGOPRIN1} alt="Logo" className="series-logoD" />
                <div className="series-perfil-iconD" onClick={() => navigate('/Perfil')} style={{ cursor: 'pointer' }}>
                    <IoPerson />
                </div>
            </div>
            {series ? (
                <>
                    <div className="series-header-contentD">
                        <img
                            className="series-posterD"
                            src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                            alt={series.name}
                        />
                        <div className="series-infoD">
                            <h1>{series.name}</h1>
                            <p>{series.overview}</p>
                            <ul className="series-detailsD">
                                <li><strong>First Air Date:</strong> {new Date(series.first_air_date).toLocaleDateString()}</li>
                                <li><strong>Number of Seasons:</strong> {series.number_of_seasons}</li>
                                <li><strong>Number of Episodes:</strong> {series.number_of_episodes}</li>
                                <li><strong>Genres:</strong> {series.genres.map(genre => genre.name).join(', ')}</li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="series-actors-titleD">Actors</h2>
                    <div className="carousel-container-custom">
                        <button className="carousel-button-custom" onClick={handlePrevActor}>
                            <FaArrowLeft />
                        </button>
                        <div className="carousel-custom">
                            {actors.slice(currentActorIndex, currentActorIndex + 4).map(actor => (
                                <div
                                    key={actor.cast_id}
                                    className="actor-item-custom"
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
                        <button className="carousel-button-custom" onClick={handleNextActor}>
                            <FaArrowRight />
                        </button>
                    </div>
                    {notification && <div className="series-notificationD">{notification}</div>}
                    {showPurchaseModal && (
                        <PurchaseModal
                            isOpen={showPurchaseModal}
                            onRequestClose={() => setShowPurchaseModal(false)}
                            series={series}
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

export default SeriesPopularesDetails;
