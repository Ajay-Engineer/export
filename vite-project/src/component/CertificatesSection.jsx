import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../axios/axios.config';

const CertificatesSection = () => {
  const scrollRef = useRef(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axiosInstance.get('/certificates');
        const data = response.data;

        if (data.success && Array.isArray(data.data)) {
          setCertificates(data.data);
        } else {
          console.error('Invalid data format:', data);
          setCertificates([]);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleNextCert = () => {
    if (certificates.length > 0) {
      setCurrentCertIndex((prevIndex) =>
        prevIndex === certificates.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevCert = () => {
    if (certificates.length > 0) {
      setCurrentCertIndex((prevIndex) =>
        prevIndex === 0 ? certificates.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <section className="w-full  bg-[rgba(91,92,88,0.5)] py-12 px-4 relative pl-10">
      {/* Heading */}
      <h2
        className="text-3xl sm:text-4xl font-bold text-black underline text-center mb-10"
        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
      >
        Certificates
      </h2>

      {/* Desktop: Horizontal Scroll Layout */}
      <div className="hidden sm:block relative max-w-7xl mx-auto">
        {certificates.length > 2 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-500 hover:bg-gray-700 text-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`flex ${
            certificates.length <= 2 ? 'justify-center' : 'overflow-x-scroll'
          } no-scrollbar gap-4 sm:gap-6 px-4 sm:px-10 scroll-smooth`}
        >
          {loading ? (
            <div className="w-full text-center py-8">Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="w-full text-center py-8">No certificates available.</div>
          ) : (
            certificates.map((certificate, index) => (
              <div
                key={certificate._id || index}
                className="group min-w-[180px] sm:min-w-[240px] max-w-[180px] sm:max-w-[260px] bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300 relative"
              >
                <img
                  src={certificate.image || '/placeholder-certificate.png'}
                  alt={certificate.title || `Certificate ${index + 1}`}
                  className="w-auto h-auto object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Image load error:', certificate.image);
                    const img = e.target instanceof HTMLImageElement ? e.target : null;
                    if (img) {
                      img.src = '/placeholder-certificate.png';
                      img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                    }
                  }}
                />
                {certificate.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white text-center font-semibold p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg">
                    {certificate.title}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {certificates.length > 2 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-500 hover:bg-gray-700 text-white p-2 rounded-full shadow-md"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Mobile: Single Certificate Carousel */}
      <div className="sm:hidden flex flex-col items-center">
        <div className="relative w-full max-w-md mx-auto">
          {loading ? (
            <div className="w-full text-center py-8">Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="w-full text-center py-8">No certificates available.</div>
          ) : (
            <>
              <motion.div
                key={currentCertIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300 relative"
              >
                <img
                  src={certificates[currentCertIndex].image || '/placeholder-certificate.png'}
                  alt={certificates[currentCertIndex].title || `Certificate ${currentCertIndex + 1}`}
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Image load error:', certificates[currentCertIndex].image);
                    const img = e.target instanceof HTMLImageElement ? e.target : null;
                    if (img) {
                      img.src = '/placeholder-certificate.png';
                      img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                    }
                  }}
                />
                {certificates[currentCertIndex].title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white text-center font-semibold p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg">
                    {certificates[currentCertIndex].title}
                  </div>
                )}
              </motion.div>

              {/* Navigation Buttons */}
              {certificates.length > 1 && (
                <div className="flex justify-between items-center mt-6 px-4">
                  <button
                    onClick={handlePrevCert}
                    className="flex items-center justify-center w-12 h-12 bg-gray-500 text-white rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Certificate Indicators */}
                  <div className="flex space-x-2">
                    {certificates.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentCertIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          index === currentCertIndex ? 'bg-gray-700' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextCert}
                    className="flex items-center justify-center w-12 h-12 bg-gray-500 text-white rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Certificate Counter */}
              <div className="text-center mt-4 text-sm text-gray-600">
                {currentCertIndex + 1} of {certificates.length}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
