import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Populares.css';
import { IoSearch, IoArrowUndoOutline } from "react-icons/io5";
import PurchaseModal from '../../PurchaseModal';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

function PopularesP() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [notification, setNotification] = useState('');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English

    const handleNavigateBack = () => {
        navigate('/HomePage');
    };

    const fetchMovies = (page) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDRkY2RmMDIzNGE1MWVlYWE0MDA4M2FjMzU5NmJmZiIsIm5iZiI6MTcyMDg4NzA1MC4xNTcxMzMsInN1YiI6IjY2MzNlNDliMDc5MmUxMDEyOTc5ODU1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y9Patl3teS8ogSMMFZYlQid7eSMnDbd1c9sINyUGylA`
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/popular?language=${selectedLanguage}&page=${page}`, options)
            .then(response => response.json())
            .then(response => {
                if (response.results && Array.isArray(response.results)) {
                    setMovies(prevMovies => [...prevMovies, ...response.results]);
                    setHasMore(page < response.total_pages);
                } else {
                    console.error('Unexpected response format:', response);
                }
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchMovies(page);
    }, [page, selectedLanguage]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDRkY2RmMDIzNGE1MWVlYWE0MDA4M2FjMzU5NmJmZiIsIm5iZiI6MTcyMDg4NzA1MC4xNTcxMzMsInN1YiI6IjY2MzNlNDliMDc5MmUxMDEyOTc5ODU1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y9Patl3teS8ogSMMFZYlQid7eSMnDbd1c9sINyUGylA`
            }
        };

        fetch('https://api.themoviedb.org/3/configuration/languages', options)
            .then(response => response.json())
            .then(response => {
                if (Array.isArray(response)) {
                    setLanguages(response);
                } else {
                    console.error('Expected array but got:', response);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
            setMovies([]); // Reset the series list when changing page to prevent appending issues
        }
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

    const handleMovieClick = (id) => {
        navigate(`/movie/${id}`);
    };

    const handlePurchaseClick = (movie) => {
        setSelectedMovie(movie);
        setShowPurchaseModal(true);
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
        fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}&language=${selectedLanguage}`)
            .then(res => res.json())
            .then(data => setSearchResults(data.results || []))
            .catch(error => console.error('Error fetching search results:', error));
    };

    const handleMovieDropdownChange = (event) => {
        const value = event.target.value;
        switch (value) {
            case "Popular":
                navigate("/Populares");
                break;
            case "proximamente":
                navigate("/Proximamente");
                break;
            case "enCartelera":
                navigate("/EnCartelera");
                break;
            default:
                break;
        }
    };

    const handleSeriesDropdownChange = (event) => {
        const value = event.target.value;
        switch (value) {
            case "popularesS":
                navigate("/SeriesPopulares");
                break;
            default:
                break;
        }
    };

    const handleGentep = (event) => {
        const value = event.target.value;
        if (value === "GentePopulares") {
            navigate("/GentePopulares");
        }
    };

    const handleLanguageChange = (event) => {
        const language = event.target.value;
        setSelectedLanguage(language);
    };

    return (
        <div className='container'>
            <header className='header'>
                <nav className='navbar'>
                    <div className='nav_item'>
                        <p className="Pelicula">{selectedLanguage === 'en' ? 'Movies' : 'Peliculas'}</p>
                        <select
                            className="PeliculaDropdown"
                            style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                            onChange={handleMovieDropdownChange}
                        >
                            <option value="">{selectedLanguage === 'en' ? 'Select' : 'Seleccionar'}</option>
                            <option value="proximamente">{selectedLanguage === 'en' ? 'Soon' : 'Proximamente'}</option>
                            <option value="enCartelera">{selectedLanguage === 'en' ? 'On Billboard' : 'En cartelera'}</option>
                        </select>
                    </div>

                    <div className='nav_item'>
                        <p className="Serie">{selectedLanguage === 'en' ? 'Series' : 'Series'}</p>
                        <select
                            className="PeliculaDropdownS"
                            style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                            onChange={handleSeriesDropdownChange}
                        >
                            <option value="">{selectedLanguage === 'en' ? 'Select' : 'Seleccionar'}</option>
                            <option value="popularesS">{selectedLanguage === 'en' ? 'Popular' : 'Populares'}</option>
                        </select>
                    </div>

                    <div className='nav_item'>
                        <p className="Gente">{selectedLanguage === 'en' ? 'Actors' : 'Actores'}</p>
                        <select
                            className="PeliculaDropdownG"
                            onChange={handleGentep}
                            style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                        >
                            <option value="">{selectedLanguage === 'en' ? 'Select' : 'Seleccionar'}</option>
                            <option value="GentePopulares">{selectedLanguage === 'en' ? 'Popular people' : 'Personas populares'}</option>
                        </select>
                    </div>

                    <div className='nav_item'>
                        <p className="LanguagePop">{selectedLanguage === 'en' ? 'Language' : 'Lenguaje'}</p>
                        <select className='language_selector' onChange={handleLanguageChange}>
                            {Array.isArray(languages) ? (
                                languages.map(language => (
                                    <option key={language.iso_639_1} value={language.iso_639_1}>
                                        {language.english_name}
                                    </option>
                                ))
                            ) : (
                                <option>No languages available</option>
                            )}
                        </select>
                    </div>

                    <div className='nav_item search_bar'>
                        <input
                            type="text"
                            placeholder={selectedLanguage === 'en' ? 'Search...' : 'Buscar...'}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button>
                            <IoSearch />
                        </button>
                    </div>
                </nav>
            </header>

            <div className='container'>
                <h1 className='title'>{selectedLanguage === 'en' ? 'Popular Movies' : 'Peliculas Populares'}</h1>
                <div className='container_btn'>
                    <button className='btn_go_home' onClick={handleNavigateBack}>
                        <IoArrowUndoOutline size={30} />
                    </button>
                </div>
                <div className='container_first'>
                    {(searchQuery ? searchResults : movies).map(movie => (
                        <div key={movie.id} className='movie_card' onClick={() => handleMovieClick(movie.id)}>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                            <h3>{movie.title}</h3>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleFavorite(movie); }}>{selectedLanguage === 'en' ? 'Favorite' : 'Favorito'}</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleWatchlist(movie); }}>{selectedLanguage === 'en' ? 'Watchlist' : 'Ver mas tarde'}</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleRate(movie); }}>{selectedLanguage === 'en' ? 'Your rating' : 'Tu calificacion'}</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handlePurchaseClick(movie); }}>{selectedLanguage === 'en' ? 'Purchase' : 'Comprar'}</button>
                        </div>
                    ))}
                </div>
                <div className='pagination'>
                    <button onClick={handlePrevPage} disabled={page === 1} style={{ backgroundColor: 'darkgrey', color: 'white', border: 'none' }}>{selectedLanguage === 'en' ? 'Show less' : 'Mostrar menos'}</button>
                    <button onClick={handleNextPage} disabled={!hasMore} style={{ backgroundColor: 'darkgrey', color: 'white', border: 'none' }}>{selectedLanguage === 'en' ? 'Show more' : 'Mostrar mas'}</button>
                </div>
                {notification && <div className="notification">{notification}</div>}
                {showPurchaseModal && (
                    <PurchaseModal
                        isOpen={showPurchaseModal}
                        onRequestClose={() => setShowPurchaseModal(false)}
                        movie={selectedMovie}
                        onPurchase={completePurchase}
                    />
                )}
            </div>
        </div>
    );
}

export default PopularesP;
