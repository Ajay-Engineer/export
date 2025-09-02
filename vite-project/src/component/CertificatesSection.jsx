
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CertificatesSection = () => {
  const scrollRef = useRef(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/certificates');
        if (!response.ok) throw new Error('Failed to fetch certificates');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.certificates)) {
          setCertificates(data.certificates);
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

  return (
    <section className="w-full bg-[rgba(91,92,88,0.5)] py-12 px-4 relative">
      {/* Heading */}
      <h2
        className="text-3xl sm:text-4xl font-bold text-black underline text-center mb-10"
        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
      >
        Certificates
      </h2>

      {/* Scrollable Container with Buttons */}
      <div className="relative max-w-7xl mx-auto">
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
          } no-scrollbar gap-6 px-10 scroll-smooth`}
        >
          {loading ? (
            <div className="w-full text-center py-8">Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="w-full text-center py-8">No certificates available.</div>
          ) : (
            certificates.map((certificate, index) => (
              <div
                key={certificate._id || index}
                className="min-w-[240px] max-w-[260px] bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={certificate.image || '/placeholder-certificate.png'}
                  alt={certificate.title || `Certificate ${index + 1}`}
                  className="w-full h-[300px] object-contain rounded-t-lg"
                  onError={(e) => {
                    console.error('Image load error:', certificate.image);
                    e.target.src = '/placeholder-certificate.png';
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                  }}
                />
                {certificate.title && (
                  <div className="p-2 text-center font-semibold">{certificate.title}</div>
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
    </section>
  );
};

export default CertificatesSection;
