import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ComponentsCSS/SeriesDetails.css';
import { IoPerson } from 'react-icons/io5';
import LOGOPRIN1 from './assets/logo1.png';

const apiKey = 'f04dcdf0234a51eeaa40083ac3596bff';

function SeriesDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [series, setSeries] = useState(null);
    const [actors, setActors] = useState([]);
    const [trailer, setTrailer] = useState('');
    const [currentActorIndex, setCurrentActorIndex] = useState(0);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => setSeries(data));

        fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => setActors(data.cast));

        fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-US`)
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

    return (
        <div className="series-detail-container">
            <div className="series-header">
                <button className="series-back-button" onClick={() => navigate('/HomePage')}>Back to Home</button>
                <img src={LOGOPRIN1} alt="Logo" className="series-logo" />
                <div className="series-perfil-icon" onClick={() => navigate('/Perfil')} style={{ cursor: 'pointer' }}>
                    <IoPerson />
                </div>
            </div>
            {series ? (
                <>
                    <div className="series-header-content">
                        <img
                            className="series-poster"
                            src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                            alt={series.name}
                        />
                        <div className="series-info">
                            <h1>{series.name}</h1>
                            <p>{series.overview}</p>
                        </div>
                    </div>

                    <div className="series-full">
                        <iframe
                            src="https://player.vimeo.com/video/[YOUR_VIDEO_ID]"
                            width="920" height="650"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            title="Series Full"
                        ></iframe>
                    </div>

                    <h2 className="series-actors-title">Actors</h2>
                    <div className="series-carousel-container">
                        <button className="series-carousel-button left" onClick={handlePrevActor}>
                            &#9664; {/* Left arrow */}
                        </button>
                        <div className="series-carousel">
                            {actors.slice(currentActorIndex, currentActorIndex + 4).map(actor => (
                                <div key={actor.cast_id} className="series-actor-item">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                        alt={actor.name}
                                    />
                                    <p>{actor.name} as {actor.character}</p>
                                </div>
                            ))}
                        </div>
                        <button className="series-carousel-button right" onClick={handleNextActor}>
                            &#9654; {/* Right arrow */}
                        </button>
                    </div>
                    {trailer && (
                        <div className="series-trailer">
                            <iframe
                                src={trailer}
                                title="Series Trailer"
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

export default SeriesDetail;
