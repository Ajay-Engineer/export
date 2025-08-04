import React from "react";

const ProductCard = ({ title, description, image, onLearnMore }) => {
  return (
    <div className="bg-white rounded shadow-md overflow-hidden p-4 flex flex-col items-center text-center">
      <img src={image} alt={title} className="w-full max-w-xs h-auto object-cover rounded-full mb-4 mx-auto" />
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <button
        onClick={onLearnMore}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Learn More
      </button>
    </div>
  );
};

export default ProductCard;
