import { useState, useEffect } from 'react';

import Rebecca_Hom_image_1 from "../assets/Rebecca_Hom_image_1.png";
import Rebecca_Hom_image_2 from "../assets/Rebecca_Hom_image_2.png";
import Rebecca_Hom_image_3 from "../assets/Rebecca_Hom_image_3.png";
import Rebecca_Hom_image_4 from "../assets/Rebecca_Hom_image_4.png";
import Rebecca_Hom_image_5 from "../assets/Rebecca_Hom_image_5.png";
import Rebecca_Hom_image_6 from "../assets/Rebecca_Hom_image_6.png";
import payment from "../assets/payment.png"

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: Rebecca_Hom_image_1,
      title: "Herbal Extract Powder",
      description: "Natural extracts from India's finest herbs – for health, wellness & personal care solutions.",
    },
    {
      image: payment,
      title: "Palm Jaggery Products",
      description: "Chemical-free palm jaggery and by-products straight from rural producers – healthy, natural & authentic.",
    },
    {
      image: Rebecca_Hom_image_2,
      title: "Coir Products",
      description: "Durable, biodegradable coir products for agriculture, gardening & industrial use.",
    },
    {
      image: Rebecca_Hom_image_3,
      title: "Tea Powders",
      description: "Premium Indian teas – handpicked and processed for the perfect aroma, taste, and health.",
    },
    {
      image: Rebecca_Hom_image_4,
      title: "Health Mix",
      description: "Traditional multigrain health mixes – rich in protein, fiber & essential nutrients for all ages.",
    },
    {
      image: Rebecca_Hom_image_5,
      title: "Handicrafts",
      description: "Authentic Indian handicrafts – blending art, culture & sustainability in every piece.",
    },
    {
      image: Rebecca_Hom_image_6,
      title: "Eggs",
      description: "High-quality egg powder for fertilizer, cosmetic formulations & membrane extraction – processed to meet global standards.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[100vh] md:h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center px-4 text-center">
            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              style={{
                fontFamily: 'Instrument Sans, -apple-system, Roboto, Helvetica, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
              }}
            >
              {slide.title}
            </h1>
            <p
              className="text-lg md:text-2xl text-white font-semibold max-w-3xl"
              style={{
                fontFamily: 'Instrument Sans, -apple-system, Roboto, Helvetica, sans-serif',
                textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {slide.description}
            </p>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full border border-white transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
