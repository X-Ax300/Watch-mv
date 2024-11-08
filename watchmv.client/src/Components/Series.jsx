import React, { useEffect, useState } from 'react';
import SeriesItem from './SeriesItem';
import './Series.css';
import { useNavigate } from 'react-router-dom';

function Series() {
    const [seriesList, setSeriesList] = useState([]);
    const [visibleSeries, setVisibleSeries] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [notification, setNotification] = useState('');
    const seriesPerPage = 5;
    const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';
    const sessionId = 'acb08a231e5fd29e0ec253bc1f961bfca274414b';
    const navigate = useNavigate();

    const getSeries = (page) => {
        fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`)
            .then(res => res.json())
            .then(json => {
                setSeriesList(prevSeriesList => [...prevSeriesList, ...json.results]);
                setHasMore(json.page < json.total_pages);
            })
            .catch(error => console.error('Error fetching series:', error));
    };

    useEffect(() => {
        getSeries(page);
    }, [page]);

    const handleNext = () => {
        if (visibleSeries + seriesPerPage >= seriesList.length && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
        setVisibleSeries(prevVisibleSeries => prevVisibleSeries + seriesPerPage);
    };

    const handlePrev = () => {
        setVisibleSeries(prevVisibleSeries => Math.max(0, prevVisibleSeries - seriesPerPage));
    };

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

    const handleSeriesClick = (seriesId) => {
        navigate(`/series/${seriesId}`);
    };

    return (
        <div>
            {notification && <div className="notification">{notification}</div>}
            <div className="series-container">
                {seriesList.slice(visibleSeries, visibleSeries + seriesPerPage).map((series) => (
                    <SeriesItem
                        key={series.id}
                        series={series}
                        onFavorite={handleFavorite}
                        onWatchlist={handleWatchlist}
                        onRate={handleRate}
                        onPurchase={completePurchase}
                        onClick={() => handleSeriesClick(series.id)}
                    />
                ))}
            </div>
            <div className="button-container">
                <button onClick={handlePrev} className="prev-button" disabled={visibleSeries === 0}>Previous</button>
                <button onClick={handleNext} className="next-button" disabled={!hasMore && visibleSeries + seriesPerPage >= seriesList.length}>Next</button>
            </div>
        </div>
    );
}

export default Series;
