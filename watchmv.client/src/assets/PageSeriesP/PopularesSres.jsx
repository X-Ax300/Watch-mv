import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularesSres.css'; // Make sure you create and link this CSS file
import { IoSearch, IoArrowUndoOutline } from "react-icons/io5";
import PurchaseModal from '../../PurchaseModal';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

function SeriesPopulares() {
    const navigate = useNavigate();
    const [series, setSeries] = useState([]); // Renamed from Names to series for clarity
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [notification, setNotification] = useState('');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [languages, setLanguages] = useState([]); // Store languages
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language to English

    const handleNavigateBack = () => {
        navigate('/HomePage');
    };

    const fetchSeries = (page) => {
        const genreQuery = selectedGenres.length ? `&with_genres=${selectedGenres.join(',')}` : '';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDRkY2RmMDIzNGE1MWVlYWE0MDA4M2FjMzU5NmJmZiIsIm5iZiI6MTcyMDg4NzA1MC4xNTcxMzMsInN1YiI6IjY2MzNlNDliMDc5MmUxMDEyOTc5ODU1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y9Patl3teS8ogSMMFZYlQid7eSMnDbd1c9sINyUGylA'
            }
        };

        fetch(`https://api.themoviedb.org/3/discover/tv?language=${selectedLanguage}&page=${page}${genreQuery}`, options)
            .then(response => response.json())
            .then(response => {
                if (page === 1) {
                    setSeries(response.results);
                } else {
                    setSeries(prevSeries => [...prevSeries, ...response.results]);
                }
                setHasMore(page < response.total_pages);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchSeries(page);
    }, [page, selectedGenres, selectedLanguage]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDRkY2RmMDIzNGE1MWVlYWE0MDA4M2FjMzU5NmJmZiIsIm5iZiI6MTcyMDg4NzA1MC4xNTcxMzMsInN1YiI6IjY2MzNlNDliMDc5MmUxMDEyOTc5ODU1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y9Patl3teS8ogSMMFZYlQid7eSMnDbd1c9sINyUGylA'
            }
        };

        fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', options)
            .then(response => response.json())
            .then(response => setGenres(response.genres))
            .catch(err => console.error(err));

        // Fetch languages
        fetch('https://api.themoviedb.org/3/configuration/languages', options)
            .then(response => response.json())
            .then(data => {
                setLanguages(data);
            })
            .catch(err => console.error('Error fetching languages:', err));
    }, []);

    const handleFavorite = (series) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'tv',
                media_id: series.id,
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

    const handleWatchlist = (series) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/watchlist?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'tv',
                media_id: series.id,
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

    const handleRate = (series) => {
        const rating = prompt('Rate this series (0.5 - 10.0):');
        if (rating) {
            fetch(`https://api.themoviedb.org/3/tv/${series.id}/rating?api_key=${apiKey}&session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: parseFloat(rating) })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setNotification('Rated series!');
                    } else {
                        setNotification(`Error: ${data.status_message}`);
                    }
                    setTimeout(() => setNotification(''), 3000);
                })
                .catch(error => console.error('Error rating series:', error));
        }
    };

    const completePurchase = (series) => {
        const purchasedSeries = JSON.parse(localStorage.getItem('purchasedSeries')) || [];
        purchasedSeries.push(series);
        localStorage.setItem('purchasedSeries', JSON.stringify(purchasedSeries));
        setNotification('Purchase successful!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handleSeriesClick = (id) => {
        navigate(`/SeriesPopulares/${id}`);
    };

    const handlePurchaseClick = (series) => {
        setSelectedSeries(series);
        setShowPurchaseModal(true);
    };

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
            setSeries([]); // Reset the series list when changing page to prevent appending issues
        }
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
        fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${apiKey}&language=${selectedLanguage}`)
            .then(res => res.json())
            .then(data => setSearchResults(data.results || []))
            .catch(error => console.error('Error fetching search results:', error));
    };

    const handleGenreChange = (e) => {
        const genreId = parseInt(e.target.value);
        if (!selectedGenres.includes(genreId)) {
            setSelectedGenres((prevSelectedGenres) => [...prevSelectedGenres, genreId]);
        } else {
            setSelectedGenres((prevSelectedGenres) => prevSelectedGenres.filter(id => id !== genreId));
        }
    };

    const resetGenres = () => {
        setSelectedGenres([]);
    };

    const handleLanguageChange = (event) => {
        const language = event.target.value;
        setSelectedLanguage(language);
    };

    return (
        <div className='container'>
            <header className='header'>
                <nav className='navbar'>
                    <div className='nav_item dropdown'>
                        <span>Peliculas</span>
                        <div className='dropdown_content'>
                            <a href="#" onClick={() => navigate('/Proximamente')}>Proximamente</a>
                            <a href="#" onClick={() => navigate('/EnCartelera')}>En Cartelera</a>
                            <a href="#" onClick={() => navigate('/Populares')}>Populares</a>
                        </div>
                    </div>



                    <div className='nav_item dropdown'>
                        <span>Gente</span>
                        <div className='dropdown_content'>
                            <a href="#" onClick={() => navigate('/GentePopulares')}>Populares</a>
                        </div>
                    </div>

                    <div className='nav_item dropdown'>
                        <p className="GeneroP">Generos</p>
                        <select onChange={handleGenreChange} className="genre-selector">
                            <option value="">Select Genre</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                        <button className='reset-button' onClick={resetGenres}>Reset Genres</button>
                    </div>

                    <div className='nav_item'>
                        <p className="LanguageP">Language</p>
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
                            placeholder="Buscar..."
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
                <h1 className='title'>Series Populares</h1>
                <div className='container_btn'>
                    <button className='btn_go_home' onClick={handleNavigateBack}>
                        <IoArrowUndoOutline size={30} />
                    </button>
                </div>
                <div className='container_first'>
                    {(searchQuery ? searchResults : series).map(serie => (
                        <div key={serie.id} className='movie_card' onClick={() => handleSeriesClick(serie.id)}>
                            <img src={`https://image.tmdb.org/t/p/w200${serie.poster_path}`} alt={serie.name} />
                            <h3>{serie.name}</h3>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleFavorite(serie); }}>Favorite</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleWatchlist(serie); }}>Watchlist</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleRate(serie); }}>Rate</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handlePurchaseClick(serie); }}>Purchase</button>
                        </div>
                    ))}
                </div>
                <div className='pagination'>
                    <button onClick={handlePrevPage} disabled={page === 1} style={{ backgroundColor: 'darkgrey', color: 'white', border: 'none' }}>Show less</button>
                    <button onClick={handleNextPage} disabled={!hasMore} style={{ backgroundColor: 'darkgrey', color: 'white', border: 'none' }}>Show more</button>
                </div>
                {notification && <div className="notification">{notification}</div>}
                {showPurchaseModal && (
                    <PurchaseModal
                        isOpen={showPurchaseModal}
                        onRequestClose={() => setShowPurchaseModal(false)}
                        series={selectedSeries}
                        onPurchase={completePurchase}
                    />
                )}
            </div>
        </div>
    );
}

export default SeriesPopulares;
