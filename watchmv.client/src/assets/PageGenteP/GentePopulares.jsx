import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GentePopulares.css';
import { IoArrowUndoOutline, IoSearch } from "react-icons/io5";
import Languague from '../../Components/Languague.jsx';
import PurchaseModal from '../../PurchaseModal';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';

function GentePopulares() {
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [notification, setNotification] = useState('');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleNavigateBack = () => {
        navigate('/HomePage');
    };

    const fetchPeople = (page) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDRkY2RmMDIzNGE1MWVlYWE0MDA4M2FjMzU5NmJmZiIsIm5iZiI6MTcyMDg4NzA1MC4xNTcxMzMsInN1YiI6IjY2MzNlNDliMDc5MmUxMDEyOTc5ODU1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y9Patl3teS8ogSMMFZYlQid7eSMnDbd1c9sINyUGylA'
            }
        };

        fetch(`https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}`, options)
            .then(response => response.json())
            .then(response => {
                setPeople(response.results);
                setHasMore(page < response.total_pages);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPeople(currentPage);
    }, [currentPage]);

    const handleFavorite = (person) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/favorite?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'person',
                media_id: person.id,
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

    const handleWatchlist = (person) => {
        fetch(`https://api.themoviedb.org/3/account/21248529/watchlist?api_key=${apiKey}&session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media_type: 'person',
                media_id: person.id,
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

    const handleRate = (person) => {
        const rating = prompt('Rate this person (0.5 - 10.0):');
        if (rating) {
            fetch(`https://api.themoviedb.org/3/person/${person.id}/rating?api_key=${apiKey}&session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: parseFloat(rating) })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setNotification('Rated person!');
                    } else {
                        setNotification(`Error: ${data.status_message}`);
                    }
                    setTimeout(() => setNotification(''), 3000);
                })
                .catch(error => console.error('Error rating person:', error));
        }
    };

    const completePurchase = (person) => {
        const purchasedPeople = JSON.parse(localStorage.getItem('purchasedPeople')) || [];
        purchasedPeople.push(person);
        localStorage.setItem('purchasedPeople', JSON.stringify(purchasedPeople));
        setNotification('Purchase successful!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handlePersonClick = (id) => {
        navigate(`/GentePopulares/${id}`);
    };

    const handlePurchaseClick = (person) => {
        setSelectedPerson(person);
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
        fetch(`https://api.themoviedb.org/3/search/person?query=${query}&api_key=${apiKey}&language=en-US`)
            .then(res => res.json())
            .then(data => setSearchResults(data.results || []))
            .catch(error => console.error('Error fetching search results:', error));
    };

    const handleNextPage = () => {
        if (hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className='container'>
            <header className='header'>
                <nav className='navbar'>
                    <div className='nav_item dropdown'>
                        <span>Películas</span>
                        <div className='dropdown_content'>
                            <a href="#" onClick={() => navigate('/Proximamente')}>Próximamente</a>
                            <a href="#" onClick={() => navigate('/EnCartelera')}>En Cartelera</a>
                            <a href="#" onClick={() => navigate('/Populares')}>Populares</a>
                        </div>
                    </div>
                    <div className='nav_item dropdown'>
                        <span>Series</span>
                        <div className='dropdown_content'>
                            <a href="#" onClick={() => navigate('/SeriesPopulares')}>Populares</a>
                        </div>
                    </div>
                    <div className='nav_item'>
                        <p className="LanguageP">Language</p>
                        <select className='language_selector' style={{ backgroundColor: 'white', color: 'black', border: 'none' }}>
                            <Languague />
                        </select>
                    </div>

                    <div className='nav_item search_bar'>
                        <input type="text" placeholder="Buscar..." value={searchQuery} onChange={handleSearchChange} />
                        <button>
                            <IoSearch />
                        </button>
                    </div>
                </nav>
            </header>

            <div className='container'>
                <h1 className='title'>Actores Populares</h1>
                <div id="12345" className='container_btn'>
                    <button className='btn_go_home' onClick={handleNavigateBack}>
                        <IoArrowUndoOutline size={30} />
                    </button>
                </div>
                <div className='container_first'>
                    {(searchQuery ? searchResults : people).map(person => (
                        <div key={person.id} className='movie_card' onClick={() => handlePersonClick(person.id)}>
                            <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} alt={person.name} />
                            <h3>{person.name}</h3>
                            <p>
                                {person.known_for.map(item => item.title || item.name).join(', ')}
                            </p>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleFavorite(person); }}>Favorite</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleWatchlist(person); }}>Watchlist</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleRate(person); }}>Rate</button>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handlePurchaseClick(person); }}>Purchase</button>
                        </div>
                    ))}
                </div>
                <div className='pagination'>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} style={{ backgroundColor: 'darkgrey', color: 'white', border: 'none' }}>
                        Previous
                    </button>
                    <button onClick={handleNextPage} disabled={!hasMore} style={{ backgroundColor: 'darkgrey', color: 'white', border: 'none' }}>
                        Next
                    </button>
                </div>
                {notification && <div className="notification">{notification}</div>}
                {showPurchaseModal && (
                    <PurchaseModal
                        isOpen={showPurchaseModal}
                        onRequestClose={() => setShowPurchaseModal(false)}
                        person={selectedPerson}
                        onPurchase={completePurchase}
                    />
                )}
            </div>
        </div>
    );
}

export default GentePopulares;
