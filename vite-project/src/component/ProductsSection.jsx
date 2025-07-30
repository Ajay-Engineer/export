import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const ProductsSection = () => {
  const products = [
    {
      name: "Herbal Products",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/c9fdbd22088b4b1d0e739745ef8aa8e627dc4d31?width=2880"
    },
    {
      name: "Health Mix",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=2880"
    },
    {
      name: "Handicrafts",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=2880"
    },
    {
      name: "Tea Powders",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=2880"
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
    <section className="w-full bg-white py-16 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-black underline mb-12 font-sans">
        Our Primary Products
      </h2>

      <div className="relative w-full">
        {/* Left Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Scrollable Product Cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-x-6 scrollbar-hide w-fit mx-auto"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="min-w-[220px] md:min-w-[250px] bg-[#B12929] rounded-xl p-4 flex-shrink-0"
            >
              <div className="w-full flex justify-center mb-4">
                <div className="w-[150px] h-[150px] md:w-[170px] md:h-[170px] rounded-full bg-[#D9D9D9] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain opacity-70"
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-center text-white">
                {product.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;
