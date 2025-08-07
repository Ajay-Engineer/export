import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CertificatesSection = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const certificates = [
    "https://api.builder.io/api/v1/image/assets/TEMP/d644c6d9f35550dd30b8da045629dcc607657818?width=504",
    "https://api.builder.io/api/v1/image/assets/TEMP/347f07495463f0120c76693987873ceeb639c3e4?width=526",
    // Add/remove images as needed
     "https://api.builder.io/api/v1/image/assets/TEMP/347f07495463f0120c76693987873ceeb639c3e4?width=526",
      "https://api.builder.io/api/v1/image/assets/TEMP/347f07495463f0120c76693987873ceeb639c3e4?width=526",
       "https://api.builder.io/api/v1/image/assets/TEMP/347f07495463f0120c76693987873ceeb639c3e4?width=526"
  ];

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
          {certificates.map((certificate, index) => (
            <div
              key={index}
              className="min-w-[240px] max-w-[260px] bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={certificate}
                alt={`Certificate ${index + 1}`}
                className="w-full h-[300px] object-contain rounded-t-lg"
              />
            </div>
          ))}
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
