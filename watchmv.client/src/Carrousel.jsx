import React from 'react';
import './carrousel.css'; // Asegúrate de crear este archivo CSS
import CarrouselImg1 from './assets/PhotoCarrousel/img1.jpg';
import CarrouselImg2 from './assets/PhotoCarrousel/img2.jpg';
import CarrouselImg3 from './assets/PhotoCarrousel/img3.jpg';
import CarrouselImg4 from './assets/PhotoCarrousel/img4.jpg';
import CarrouselImg5 from './assets/PhotoCarrousel/img5.jpg';
import CarrouselImg6 from './assets/PhotoCarrousel/img6.jpg';
import CarrouselImg7 from './assets/PhotoCarrousel/img7.jpg';
import CarrouselImg8 from './assets/PhotoCarrousel/img8.jpg';
import CarrouselImg9 from './assets/PhotoCarrousel/img9.jpg';

const images = [
    CarrouselImg1, CarrouselImg2, CarrouselImg3, CarrouselImg4, CarrouselImg5,
    CarrouselImg6, CarrouselImg7, CarrouselImg8, CarrouselImg9
];

const Carousel = () => {
    return (
        <div className="carousel">
            <div className="carousel-images">
                {images.concat(images).map((image, index) => (
                    <div key={index} className="carousel-image">
                        <img src={image} alt={`Imagen ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carousel;