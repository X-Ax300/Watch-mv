import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComponentsCSS/Perfil.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestoreInstance, app } from './firestore';
import { IoPersonCircleOutline } from 'react-icons/io5';

const auth = getAuth(app);

function Perfil() {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [purchased, setPurchased] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
    const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                fetchFavorites(user);
                fetchPurchasedMovies();
                await fetchUserDetails(user.uid);
            } else {
                navigate('/');
            }
        });
        return unsubscribe;
    }, [navigate]);

    const fetchUserDetails = async (userId) => {
        try {
            const userQuery = query(collection(firestoreInstance, 'User'), where('userID', '==', userId));
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0];
                // Save the document ID and data
                setUserDetails({ id: userData.id, ...userData.data() });
                console.log("User document ID:", userData.id); // Debug log
            } else {
                console.error('No user document found for this user ID.');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchFavorites = (user) => {
        fetch(`https://api.themoviedb.org/3/account/${user.uid}/favorite/movies?api_key=${apiKey}&session_id=${sessionId}&language=en-US&sort_by=created_at.asc`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status_message) {
                    setError(data.status_message);
                } else {
                    setFavorites(data.results || []);
                }
            })
            .catch(error => console.error('Error fetching favorites:', error));
    };

    const fetchPurchasedMovies = () => {
        const purchasedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
        setPurchased(purchasedMovies);
    };

    const handleHomePage = () => {
        navigate('/HomePage');
    };

    const handleRemoveFavorite = (movieId) => {
        fetch(`https://api.themoviedb.org/3/account/${user.uid}/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: movieId,
                favorite: false
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setFavorites((prevFavorites) => prevFavorites.filter(movie => movie.id !== movieId));
                } else {
                    setError(`Error: ${data.status_message}`);
                }
            })
            .catch(error => console.error('Error removing favorite:', error));
    };

    const handleCancelSubscription = async () => {
        const confirmCancel = window.confirm("Are you sure you want to unsubscribe? You will lose your privileges.");
        if (confirmCancel && userDetails && userDetails.id) {
            try {
                const userRef = doc(firestoreInstance, 'User', userDetails.id);
                await updateDoc(userRef, {
                    payment: 0 
                });
                setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    payment: 0
                }));
                alert("Your subscription has been canceled.");
                console.log('Subscription canceled for user:', userDetails.id); // Debug log
            } catch (error) {
                console.error('Error cancelling subscription:', error);
            }
        }
    };

    return (
        <div className="perfil">
            {user ? (
                <div className="profile-container">
                    <div className="profile-header">
                        <IoPersonCircleOutline className="profile-icon" />
                        <div className="user-details">
                            <h1>{userDetails?.nombre || user.displayName || "User"}</h1>
                            <p>Email: {user.email}</p>
                            <p>Suscrito: {userDetails?.payment === 1 ? 'si' : 'No'}</p>
                            <p>fecha de suscripcion: {userDetails?.subscriptionDate || 'N/A'}</p>
                        </div>
                    </div>

                    <button className="home-button" onClick={handleHomePage}>Go to Homepage</button>

                    {userDetails?.payment === 1 && ( // Show unsubscribe button if subscribed
                        <button className="unsubscribe-button" onClick={handleCancelSubscription}>Unsubscribe</button>
                    )}
                    {error && <div className="error">{error}</div>}

                    <div className="section favorites">
                        <h2>Favorites</h2>
                        <div className="favorites-container">
                            {favorites.length > 0 ? (
                                favorites.map(movie => (
                                    <div key={movie.id} className="movie-item">
                                        <img
                                            className="movie-poster"
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                        <div className="movie-details">
                                            <h3>{movie.title}</h3>
                                            <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                                            <button onClick={() => handleRemoveFavorite(movie.id)}>Remove</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No favorites added yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="section purchased">
                        <h2>Purchased Movies</h2>
                        <div className="purchased-container">
                            {purchased.length > 0 ? (
                                purchased.map(movie => (
                                    <div key={movie.id} className="movie-item">
                                        <img
                                            className="movie-poster"
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                        <div className="movie-details">
                                            <h3>{movie.title}</h3>
                                            <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No purchased movies yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Perfil;
