import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../ComponentsCSS/GentePopularesDetails.css';
import { IoPerson } from 'react-icons/io5';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import LOGOPRIN1 from '../../assets/logo1.png';
import PurchaseModal from '../../PurchaseModal';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

function GentePopularesDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchPersonDetails(id);
        fetchPersonMovies(id);
    }, [id]);

    const fetchPersonDetails = async (personId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}&language=en-US`);
            const data = await response.json();
            setPerson(data);
        } catch (error) {
            console.error('Error fetching person details:', error);
        }
    };

    const fetchPersonMovies = async (personId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${apiKey}&language=en-US`);
            const data = await response.json();
            setMovies(data.cast);
        } catch (error) {
            console.error('Error fetching person movies:', error);
        }
    };

    const handleNextMovie = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex + 4) % movies.length);
    };

    const handlePrevMovie = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex - 4 + movies.length) % movies.length);
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`); // Navigate to movie details page
    };

    const handleFavorite = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/account/21248529/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    media_type: 'person',
                    media_id: person.id,
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
                    media_type: 'person',
                    media_id: person.id,
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
        const rating = prompt('Rate this person (0.5 - 10.0):');
        if (rating) {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/person/${person.id}/rating?api_key=${apiKey}&session_id=${sessionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ value: parseFloat(rating) })
                });
                const data = await response.json();
                if (data.success) {
                    setNotification('Rated person!');
                } else {
                    setNotification(`Error: ${data.status_message}`);
                }
                setTimeout(() => setNotification(''), 3000);
            } catch (error) {
                console.error('Error rating person:', error);
            }
        }
    };

    const completePurchase = (person) => {
        const purchasedPeople = JSON.parse(localStorage.getItem('purchasedPeople')) || [];
        purchasedPeople.push(person);
        localStorage.setItem('purchasedPeople', JSON.stringify(purchasedPeople));
        setNotification('Purchase successful!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handlePurchaseClick = () => {
        setShowPurchaseModal(true);
    };

    return (
        <div className="person-detail">
            <div className="header">
                <button className="back-button" onClick={() => navigate('/GentePopulares')}>Back to Popular People</button>
                <img src={LOGOPRIN1} alt="Logo" className="logo" />
                <div className="perfil-icon" onClick={() => navigate('/Perfil')} style={{ cursor: 'pointer' }}>
                    <IoPerson />
                </div>
            </div>
            {person ? (
                <>
                    <div className="person-header">
                        <img
                            className="person-poster"
                            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                            alt={person.name}
                        />
                        <div className="person-info">
                            <h1>{person.name}</h1>
                            <p>{person.biography}</p>
                            <ul className="person-details">
                                <li><strong>Known For:</strong> {person.known_for_department}</li>
                                <li><strong>Known Credits:</strong> {movies.length}</li>
                                <li><strong>Gender:</strong> {person.gender === 1 ? 'Female' : 'Male'}</li>
                                <li><strong>Birthday:</strong> {new Date(person.birthday).toLocaleDateString()}</li>
                                <li><strong>Place of Birth:</strong> {person.place_of_birth}</li>
                                <li><strong>Also Known As:</strong> {person.also_known_as.join(', ')}</li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="movies-title">Known For</h2>
                    <div className="carousel-containerGP">
                        <button className="carousel-buttonGP left" onClick={handlePrevMovie}>
                            <FaArrowLeft />
                        </button>
                        <div className="carouselGP">
                            {movies.slice(currentMovieIndex, currentMovieIndex + 4).map(movie => (
                                <div
                                    key={movie.id}
                                    className="movie-item"
                                    onClick={() => handleMovieClick(movie.id)} // Navigate to movie details on click
                                    style={{ cursor: 'pointer' }} // Add cursor pointer
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <p>{movie.title}</p>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-buttonGP right" onClick={handleNextMovie}>
                            <FaArrowRight />
                        </button>
                    </div>
                    {notification && <div className="notification">{notification}</div>}
                    {showPurchaseModal && (
                        <PurchaseModal
                            isOpen={showPurchaseModal}
                            onRequestClose={() => setShowPurchaseModal(false)}
                            person={person}
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

export default GentePopularesDetails;
