import React from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "./ProductList";

const HerbalProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Background */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Palm Jaggery Products</h1>
            <p className="text-xl text-red-100">Explore Our Natural Sweeteners</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Product List Component */}
        <ProductList category="palm-jaggery" />

        {/* Back to Menu Button */}
        <div className="flex justify-center mt-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HerbalProducts;
