import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestoreInstance, app } from './firestore';
import './HomePage.css';
import Movie from './Components/Movie.jsx';
import LOGOPRIN1 from './assets/logo1.png';
import Languague from './Components/Languague.jsx';
import Popular from './Components/Trailer';
import TrailerTrue from './Components/TrailerTrue';
import Series from './Components/Series';
import { IoPersonCircleOutline, IoLogOutSharp } from 'react-icons/io5';
import { MdOutlinePayment } from 'react-icons/md';
import PurchaseModal from './PurchaseModal'; // Importa tu componente de modal
import SubscriptionNotification from './Components/SubscriptionNotification'; // Import the new component

const auth = getAuth(app);

function HomePage() {
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [subscriptionStatus, setSubscriptionStatus] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Controla la visibilidad del modal
    const [showNotification, setShowNotification] = useState(false); // State to control notification visibility
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                fetchFavorites(user);
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
                setUserDetails(userData);
                setSubscriptionStatus(userData.data().payment); // Set the subscription status
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchFavorites = (user) => {
        const token = 'f04dcdf0234a51eeaa40083ac3596bff'; // Replace with your API token
        fetch(`https://api.themoviedb.org/3/account/${user.uid}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => setFavorites(data.results || []))
            .catch(error => console.error('Error fetching favorites:', error));
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/');
        });
    };

    const handlePerfil = () => {
        navigate('/Perfil');
    };

    const handleGentep = (e) => {
        if (e.target.value === 'GentePopulares') {
            navigate('/GentePopulares');
        }
    };

    const handleSeriesDropdownChange = (e) => {
        if (e.target.value === 'popularesS') {
            navigate('/SeriesPopulares');
        }
    };

    const handleMovieDropdownChange = (e) => {
        const value = e.target.value;
        if (value === 'populares') {
            navigate('/Populares');
        } else if (value === 'proximamente') {
            navigate('/Proximamente');
        } else if (value === 'enCartelera') {
            navigate('/EnCartelera');
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            fetchSearchResults(query);
        } else {
            setSearchResults([]);
        }
    };

    const fetchSearchResults = (query) => {
        const token = 'f04dcdf0234a51eeaa40083ac3596bff'; // Replace with your API token
        fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US&api_key=${token}`)
            .then(res => res.json())
            .then(data => setSearchResults(data.results || []))
            .catch(error => console.error('Error fetching search results:', error));
    };

    const handleSubscription = () => {
        if (subscriptionStatus === 0) {
            setShowNotification(true); // Show the custom notification
        } else {
            alert('You are already subscribed!');
        }
    };

    const handleConfirmPayment = async () => {
        try {
            const userRef = doc(firestoreInstance, 'User', userDetails.id);
            const subscriptionDate = new Date();
            await updateDoc(userRef, {
                payment: 1,
                subscriptionDate: subscriptionDate.toISOString()
            });
            setSubscriptionStatus(1); // Update local subscription status
            setIsPaymentModalOpen(false); // Close payment modal
            alert("Subscription successful! You are now subscribed.");
        } catch (error) {
            console.error('Error updating subscription status:', error);
        }
    };

    const handleNotificationClose = () => {
        setShowNotification(false); // Close the notification
        setIsPaymentModalOpen(false); // Ensure the payment modal is closed
    };

    return (
        <div className="HomePage">
            {showNotification && ( // Show the notification when showNotification is true
                <SubscriptionNotification
                    onConfirm={() => {
                        setShowNotification(false);
                        setIsPaymentModalOpen(true);
                    }}
                    onClose={handleNotificationClose} // Reset the notification state
                />
            )}

            <div className="HeaderHomePage">
                <div className="LogOutIcon" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <IoLogOutSharp />
                </div>
                <div className='Logo1'>
                    <img src={LOGOPRIN1} alt='Logo' className="Logo1" />
                </div>
                {subscriptionStatus === 0 && ( // Show the subscription button only if not subscribed
                    <div className="SubscriptionButton" onClick={handleSubscription} style={{ cursor: 'pointer' }}>
                        <MdOutlinePayment />
                        Subscribe
                    </div>
                )}
                <div className="PerfilIcon" onClick={handlePerfil} style={{ cursor: 'pointer' }}>
                    <IoPersonCircleOutline />
                </div>
            </div>

            <div className="Welcome">
                <h1 className="Welabel">Welcome</h1>
                <br />
                <h1 className="Welabel2">To</h1>
                <br />
                <h1 className="Welabel3">Watch.MV!</h1>
            </div>

            <div className="VideoWelcome">
                <iframe
                    className="welcomeVideo"
                    src="https://www.youtube.com/embed/vmD1W8HjBEU?autoplay=1&mute=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
                <div className="videoOverlay"></div>
            </div>

            <div className="Bar">
                <p className="Pelicula">{selectedLanguage === 'en' ? 'Movies' : 'Peliculas'}</p>
                <select
                    className="PeliculaDropdown"
                    style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                    onChange={handleMovieDropdownChange}
                >
                    <option value="">{selectedLanguage === 'en' ? 'Select' : 'Seleccionar'}</option>
                    <option value="populares">{selectedLanguage === 'en' ? 'Popular' : 'Populares'}</option>
                    <option value="proximamente">{selectedLanguage === 'en' ? 'Soon' : 'Proximamente'}</option>
                    <option value="enCartelera">{selectedLanguage === 'en' ? 'On Billboard' : 'En cartelera'}</option>
                </select>

                <p className="Serie">{selectedLanguage === 'en' ? 'Series' : 'Series'}</p>
                <select
                    className="PeliculaDropdownS"
                    style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                    onChange={handleSeriesDropdownChange}
                >
                    <option value="">{selectedLanguage === 'en' ? 'Select' : 'Seleccionar'}</option>
                    <option value="popularesS">{selectedLanguage === 'en' ? 'Popular' : 'Populares'}</option>
                </select>

                <p className="Gente">{selectedLanguage === 'en' ? 'Actors' : 'Actores'}</p>
                <select
                    className="PeliculaDropdownG"
                    onChange={handleGentep}
                    style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                >
                    <option value="">{selectedLanguage === 'en' ? 'Select' : 'Seleccionar'}</option>
                    <option value="GentePopulares">{selectedLanguage === 'en' ? 'Popular people' : 'Personas populares'}</option>
                </select>
                <p className="LanguageHome">Language</p>
                <select className="PeliculaDropdownI" onChange={handleLanguageChange} style={{ backgroundColor: 'black', color: 'white', border: 'none' }}>
                    <Languague />
                </select>

                <input
                    type="search"
                    className="SearchBox"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {searchResults.length > 0 && (
                <div className="SearchResults">
                    {searchResults.map(result => (
                        <div key={result.id} className="search-result-item" onClick={() => handleMovieClick(result.id)}>
                            <img
                                className="search-result-poster"
                                src={`https://image.tmdb.org/t/p/w200${result.poster_path || result.profile_path}`}
                                alt={result.title || result.name}
                            />
                            <div className="search-result-details">
                                <h3>{result.title || result.name}</h3>
                                <p>{result.media_type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="TreText">
                <p>{selectedLanguage === 'en' ? 'Trending' : 'Tendencias'}</p>
            </div>
            <div className="Trending">
                <div className="movie-container">
                    <Movie onMovieClick={handleMovieClick} />
                </div>
            </div>

            <div className="FreeToWatch"></div>

            <div className="PoText">
                <p>{selectedLanguage === 'en' ? 'Popular' : 'Populares'}</p>
            </div>

            <div className="Popular">
                <Popular />
            </div>

            <div className="PoTrailerTrue">
                <p>
                    {selectedLanguage === 'en' ? 'Trailers' : 'Trailers'}
                </p>
            </div>
            <div className="TrailerTrue">
                <TrailerTrue />
            </div>

            <div className="PoTextSe">
                <p>{selectedLanguage === 'en' ? 'Series' : 'Series'}</p>
            </div>

            <div className="Series">
                <div className="series-container">
                    <Series />
                </div>
            </div>

            {user && (
                <div className="Favorites">
                    <div className="favorites-container">
                        {favorites.map(movie => (
                            <div key={movie.id} className="movie-item" onClick={() => handleMovieClick(movie.id)}>
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
                        ))}
                    </div>
                </div>
            )}

            <PurchaseModal
                isOpen={isPaymentModalOpen}
                onRequestClose={() => setIsPaymentModalOpen(false)}
                isSubscription={true}
                onSubscribe={handleConfirmPayment}
            />

            <footer className='footer'>
                <p>&copy; Watch.mv Inc. 2024</p>
            </footer>
        </div>
    );
}

export default HomePage;
