import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${API_URL}/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const showPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <section className="w-full py-16 px-4 text-white bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          Loading testimonials...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 px-4 text-white bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          {error}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="w-full py-16 px-4 text-white bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          No testimonials available.
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full py-16 px-4 text-white"
      style={{
        background:
          "url('https://api.builder.io/api/v1/image/assets/TEMP/b1a62d96b6d247000ac091ea08e7b1c79a2e785f?width=2880') center/cover no-repeat, #606163",
      }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold underline text-center mb-12 font-sans">
        What Global Clients Say
      </h2>

      {/* Desktop View - Show all */}
      <div className="hidden md:grid grid-cols-2 gap-10 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          console.log('Rendering testimonial:', testimonial), // Debug log
          <div
            key={index}
            className="bg-white text-black rounded-lg p-6 flex flex-col md:flex-row shadow-lg"
          >
            <img
              src={testimonial.image.startsWith('http') 
                ? testimonial.image 
                : `http://localhost:3001${testimonial.image}`}
              alt={testimonial.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover mb-4 md:mb-0 md:mr-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'placeholder-image-url';
              }}
            />
            <div>
              <h3 className="text-2xl font-semibold mb-1">
                {testimonial.name}
                
              </h3>
              <span className="text-lg font-semibold">{testimonial.companyName}, {testimonial.country}</span> 
              <p className="text-lg">{testimonial.quote}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - One testimonial with nav */}
      <div className="md:hidden max-w-md mx-auto">
        <div className="bg-white text-black rounded-lg p-6 flex flex-col items-center shadow-lg">
          <img
            src={testimonials[currentIndex].image.startsWith('http') 
              ? testimonials[currentIndex].image 
              : `http://localhost:3001${testimonials[currentIndex].image}`}
            alt={testimonials[currentIndex].name}
            className="w-24 h-24 rounded-lg object-cover mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'placeholder-image-url';
            }}
          />
          <h3 className="text-lg font-semibold mb-2 text-center">
            {testimonials[currentIndex].name}
          </h3>
          <p className="text-center text-base">
            {testimonials[currentIndex].quote}
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={showPrevious}
            className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-600"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            onClick={showNext}
            className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-600"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
