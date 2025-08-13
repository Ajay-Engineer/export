import React, { useState } from "react";

const ProductCard = ({ title, description, image, onLearnMore }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative w-full max-w-xs h-48 mb-4">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        )}
        <img
          src={imageError ? '/src/assets/react.svg' : image}
          alt={title}
          className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
      <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 flex-grow">{description}</p>
      <button
        onClick={onLearnMore}
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Learn More
      </button>
    </div>
  );
};

export default ProductCard;
