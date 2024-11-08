import React from 'react';
import Slider from 'react-slick';
import './TrailerTrue.css';

function TrailerTrue() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Número de videos visibles a la vez
        slidesToScroll: 1, // Cantidad de videos a desplazar por vez
        autoplay: true,
        autoplaySpeed: 3000, // Velocidad de reproduccion automatica en milisegundos
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0
                }
            }
        ]
    };

    // Lista de videos de YouTube
    const videoList = [
        { id: 1, title: 'Alien: Romulus', videoId: 'OzY2r2JXsDM' },
        { id: 2, title: 'La Fiesta De Las Salchichas 2', videoId: 'YtcS6arQUIM' },
        { id: 3, title: 'Kalki 2898 AD Trailer - Hindi', videoId: 'kQDd1AhGIHk' },
        { id: 4, title: 'BAD BOYS 4: Ride or Die Trailer Spanish (2024)', videoId: 'i1S6NT6Fsfo' },
        { id: 5, title: 'Bob Esponja: Al rescate | Trailer oficial | Netflix', videoId: 'BUFKUy_c5Tw' },
        { id: 6, title: 'Deadpool & Wolverine | Trailer Oficial | Doblado', videoId: 'UzFZR2dRsSY' },
        { id: 7, title: 'Moana 2 | Trailer Oficial | Doblado', videoId: 'oG_lt31kFfc' },
        { id: 8, title: 'Mi villano favorito 4 - Trailer oficial (Universal Pictures) HD', videoId: 'B67V2aTCLmo' },
        { id: 9, title: 'Aquaman y el Reino Perdido | Trailer Oficial | Doblado', videoId: 'M8W_y0mmJEc' },
        { id: 10, title: 'TRANSFORMERS 7: EL DESPERTAR DE LAS BESTIAS Trailer Spanish Latino (2023)', videoId: 'v0d0id78XdE' },
        { id: 11, title: 'Ted 2 - Trailer Spanish (HD)', videoId: 'sf1okbrF1tI' },
        { id: 12, title: 'Evil Dead: El Despertar - Trailer Oficial en Spanish Latino', videoId: 'qrl1JWv4df8' },
        { id: 13, title: 'Nunca apagues la luz', videoId: 'w1VXHtIqrYU' },
        { id: 14, title: 'INSIDIOUS: LA PUERTA ROJA. Trailer oficial en Spanish HD.', videoId: 'gp4Z6bZ5tVU' },
        { id: 15, title: 'LA MONJA II | TRAILER OFICIAL | DOBLADO', videoId: 'Em7wEqLzDnE' },
        { id: 16, title: 'La Llorona - Trailer Final', videoId: 'JoTbiH3Wppo' },
    ];

    return (
        <div className="Trailer">
            <Slider {...settings}>
                {videoList.map(video => (
                    <div key={video.id} className="trailer-slide">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title={`YouTube Video ${video.id}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <p>{video.title}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default TrailerTrue;
