import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance, { formatImageUrl } from '../axios/axios.config';

/**
 * A section component that displays testimonials in a carousel format.
 * Fetches testimonials from the backend and displays them with navigation controls.
 * @returns {React.ReactElement} The testimonials section component
 */
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axiosInstance.get('/testimonials');
        if (response.data && response.data.success) {
          setTestimonials(response.data.data || []);
        } else {
          setError('No testimonials found');
          setTestimonials([]);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError(error.response?.data?.message || 'Failed to load testimonials');
        setTestimonials([]);
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
          <p className="text-red-400">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (!testimonials.length) {
    return (
      <section className="w-full py-16 px-4 text-white bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p>No testimonials available.</p>
        </div>
      </section>
    );
  }


  return (
    <section
      className="relative w-full py-6 md:py-12 lg:py-16 px-4 overflow-hidden"
      style={{
        background: `url('https://api.builder.io/api/v1/image/assets/TEMP/11ff832bc261c20f5a9163fb10ae63a0268aef7b?width=2880') center/cover no-repeat, #6A6B6D`
      }}
    >

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8 lg:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            Client Testimonials
          </h2>
          <p className="text-sm md:text-base text-blue-100 max-w-lg mx-auto leading-relaxed">
            Hear what our global clients have to say about their experience
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 border border-white/20">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-lg bg-gradient-to-br from-red-100 to-red-200">
                    <img
                      src={testimonials[currentIndex].image.startsWith('http')
                        ? testimonials[currentIndex].image
                         : formatImageUrl(testimonials[currentIndex].image)}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.target instanceof HTMLImageElement) {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }
                      }}
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-1 rounded-full border-2 border-red-500/40"></div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg className="w-8 h-8 text-blue-500 mx-auto lg:mx-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6 font-medium">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-base text-blue-600 font-medium">
                      {testimonials[currentIndex].companyName}
                    </p>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      {testimonials[currentIndex].country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                onClick={showPrevious}
                className="group relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
              >
                <ChevronLeft className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              {/* Progress Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-6 h-2 bg-white shadow-lg'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                    } rounded-full`}
                  >
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={showNext}
                className="group relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
              >
                <ChevronRight className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
              <span className="text-white/70 text-sm font-medium">
                {currentIndex + 1} of {testimonials.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
