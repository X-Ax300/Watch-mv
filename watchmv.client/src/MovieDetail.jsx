import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ComponentsCSS/MovieDetail.css';
import { IoPerson } from 'react-icons/io5';
import LOGOPRIN1 from './assets/logo1.png';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';

function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [actors, setActors] = useState([]);
    const [trailer, setTrailer] = useState('');
    const [movieLink, setMovieLink] = useState('');
    const [currentActorIndex, setCurrentActorIndex] = useState(0);
    const [selectedServer, setSelectedServer] = useState('streamwish'); // Estado para el servidor seleccionado

    useEffect(() => {
        // Fetch movie details
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => setMovie(data));

        // Fetch movie credits
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => setActors(data.cast));

        // Fetch movie trailer
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => {
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                setTrailer(trailer ? `https://www.youtube.com/embed/${trailer.key}` : '');
            });

        // Generate movie link based on selected server
        const generateMovieLink = (serviceProvider, movieId) => {
            switch (serviceProvider) {
                case 'streamwish':
                    return `https://streamwish.com/embed/${movieId}`;
                case 'filemoon':
                    return `https://filemoon.sx/e/${movieId}`;
                case 'doodstream':
                    return `https://doodstream.com/d/${movieId}`;
                default:
                    return '';
            }
        };

        // Set the movie link based on the selected server
        setMovieLink(generateMovieLink(selectedServer, id));

    }, [id, selectedServer]); // Update whenever the id or selectedServer changes

    const handleServerChange = (event) => {
        setSelectedServer(event.target.value); // Update the selected server
    };

    const handleNextActor = () => {
        setCurrentActorIndex((prevIndex) => (prevIndex + 4) % actors.length);
    };

    const handlePrevActor = () => {
        setCurrentActorIndex((prevIndex) => (prevIndex - 4 + actors.length) % actors.length);
    };

    const handleActorClick = (actorId) => {
        navigate(`/GentePopulares/${actorId}`); // Navigate to actor details page
    };

    return (
        <div className="movie-detail-custom">
            <div className="header-custom">
                <button className="back-button-custom" onClick={() => navigate('/HomePage')}>Back to Home</button>
                <img src={LOGOPRIN1} alt="Logo" className="logo-custom" />
                <div className="perfil-icon-custom" onClick={() => navigate('/Perfil')} style={{ cursor: 'pointer' }}>
                    <IoPerson />
                </div>
            </div>
            {movie ? (
                <>
                    <div className="movie-header-custom">
                        <img
                            className="movie-poster-custom"
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <div className="movie-info-custom">
                            <h1>{movie.title}</h1>
                            <p>{movie.overview}</p>
                        </div>
                    </div>

                    {/* Opciones para cambiar de servidor */}
                    <div className="server-selection">
                        <label htmlFor="serverSelect">Choose a server: </label>
                        <select
                            id="serverSelect"
                            value={selectedServer}
                            onChange={handleServerChange}
                            className="server-select"
                        >
                            <option value="streamwish">Streamwish</option>
                            <option value="filemoon">Filemoon</option>
                            <option value="doodstream">Doodstream</option>
                        </select>
                    </div>

                    {/* Visualización de la película*/}
                    <div className="movie-full-custom">
                        {movieLink ? (
                            <iframe
                                src={movieLink}
                                width="920" height="650"
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                title="Movie Full"
                            ></iframe>
                        ) : (
                            <p>No available link for this server.</p>
                        )}
                    </div>

                    <h2 className="actors-title-custom">Actors</h2>
                    <div className="carousel-container-custom">
                        <button className="carousel-button-custom" onClick={handlePrevActor}>
                            &#9664; {/* Left arrow */}
                        </button>
                        <div className="carousel-custom">
                            {actors.slice(currentActorIndex, currentActorIndex + 4).map(actor => (
                                <div
                                    key={actor.cast_id}
                                    className="actor-item-custom"
                                    onClick={() => handleActorClick(actor.id)} // Navigate on click
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
                            &#9654; {/* Right arrow */}
                        </button>
                    </div>
                    {trailer && (
                        <div className="trailer-custom">
                            <iframe
                                src={trailer}
                                title="Movie Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default MovieDetail;
