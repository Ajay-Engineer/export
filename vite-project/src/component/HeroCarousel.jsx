import { useState, useEffect } from "react";

import Rebecca_Hom_image_1 from "../assets/Rebecca_Hom_image_1.png";
import Rebecca_Hom_image_2 from "../assets/Rebecca_Hom_image_2.png";
import Rebecca_Hom_image_3 from "../assets/Rebecca_Hom_image_3.png";
import Rebecca_Hom_image_4 from "../assets/Rebecca_Hom_image_4.png";
import Rebecca_Hom_image_5 from "../assets/Rebecca_Hom_image_5.png";
import Rebecca_Hom_image_6 from "../assets/Rebecca_Hom_image_6.png";
import payment from "../assets/payment.png";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: Rebecca_Hom_image_1,
      title: "Herbal Extract Powder",
      description:
        "Trusted by global wellness experts — pure Indian herbs for health, vitality, and care.",
    },
    {
      image: payment,
      title: "Palm Jaggery Products",
      description:
        "Naturally processed, export-quality palm jaggery — preferred by health-conscious consumers worldwide.",
    },
    {
      image: Rebecca_Hom_image_2,
      title: "Coir Products",
      description:
        "Sustainable coir-based solutions — empowering global industries with eco-conscious alternatives.",
    },
    {
      image: Rebecca_Hom_image_3,
      title: "Tea Powders",
      description:
        "From estates to elite cups — our Indian teas are chosen by global tea sommeliers and wellness chefs.",
    },
    {
      image: Rebecca_Hom_image_4,
      title: "Health Mix",
      description:
        "Scientifically blended superfoods — fueling athletes, nutritionists, and daily health enthusiasts.",
    },
    {
      image: Rebecca_Hom_image_5,
      title: "Handicrafts",
      description:
        "Ethically sourced artisan pieces — loved by interior designers and global décor specialists.",
    },
    {
      image: Rebecca_Hom_image_6,
      title: "Egg Products",
      description:
        "Pharma & food-grade egg powders — trusted by world-class manufacturers and export regulators.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Responsive height: 45vh mobile, 80vh laptop+ */}
      <div className="h-[45vh] md:h-[80vh] min-h-[300px] relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4 md:px-8">
              <h1
                className="text-xl md:text-4xl font-bold text-white mb-2 md:mb-4 leading-tight"
                style={{ fontFamily: "Instrument Sans, sans-serif" }}
              >
                {slide.title}
              </h1>
              <p
                className="text-sm md:text-xl text-white font-medium max-w-md md:max-w-3xl"
                style={{ fontFamily: "Instrument Sans, sans-serif" }}
              >
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full border border-white transition-colors duration-300 ${
                index === currentSlide ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
