import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

// Map product names to local asset images
import herbalImg from '../assets/Rebecca_Hom_image_1.png';
import healthMixImg from '../assets/Rebecca_Hom_image_2.png';
import handicraftsImg from '../assets/Rebecca_Hom_image_3.png';
import teaPowdersImg from '../assets/Rebecca_Hom_image_4.png';

const ProductsSection = () => {
  const products = [
    {
      name: "Herbal Products",
      image: herbalImg
    },
    {
      name: "Health Mix",
      image: handicraftsImg
    },
    {
      name: "Handicrafts",
      image:  healthMixImg
    },
    {
      name: "Tea Powders",
      image: teaPowdersImg
    }
  ];

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-white py-12 px-2 md:px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black underline mb-6 md:mb-10">
        Our Primary Products
      </h2>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Left Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Scrollable Product Cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto justify-between gap-x-4 md:gap-x-6 scrollbar-hide w-full px-1 md:px-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="min-w-[55vw] max-w-[65vw] sm:min-w-[180px] sm:max-w-[210px] md:min-w-[250px] md:max-w-[270px] bg-[#B12929] rounded-xl p-2 sm:p-3 md:p-4 flex-shrink-0 flex flex-col items-center shadow-md"
            >
              <div className="w-[70px] h-[70px] sm:w-[110px] sm:h-[110px] md:w-[170px] md:h-[170px] rounded-full bg-[#D9D9D9] overflow-hidden flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-90 rounded-none"
                  style={{ aspectRatio: '1/1', display: 'block' }}
                  loading="lazy"
                />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-semibold text-center text-white">
                {product.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;
