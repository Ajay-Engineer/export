import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import {
  HeartPulse,
  Egg,
  Hand,
  Sparkles,
  Home,
  Leaf,
} from "lucide-react";

export default function ProductsPage() {
  const navigate = useNavigate();

  const products = [
    {
      name: "Health Mix",
      path: "/products/health-mix",
      icon: <HeartPulse className="w-8 h-8 text-red-600" />,
      description: "Nutritious health mix products for daily wellness",
    },
    {
      name: "Egg Products",
      path: "/products/egg",
      icon: <Egg className="w-8 h-8 text-red-600" />,
      description: "Quality egg products and poultry items",
    },
    {
      name: "Handicrafts",
      path: "/products/handicraft",
      icon: <Hand className="w-8 h-8 text-red-600" />,
      description: "Beautiful handcrafted items and artisanal products",
    },
    {
      name: "Decor Items",
      path: "/products/decor-items",
      icon: <Sparkles className="w-8 h-8 text-red-600" />,
      description: "Elegant decorative items and home accessories",
    },
    {
      name: "Home Textile",
      path: "/products/home-textile",
      icon: <Home className="w-8 h-8 text-red-600" />,
      description: "Premium home textile products and fabrics",
    },
    {
      name: "Bamboo Products",
      path: "/products/bamboo-products",
      icon: <Leaf className="w-8 h-8 text-red-600" />,
      description: "Eco-friendly bamboo products and sustainable goods",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Header - Flex row with left, center, right */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-8 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {/* Left: Back to Home */}
            <Link
              to="/"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium bg-red-50 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            {/* Center: Our Products */}
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-center flex-1 text-gray-800 px-2">
              Our Products
            </h1>
            {/* Right: Close button */}
            <button
              onClick={() => navigate('/')}
              aria-label="Close"
              className="ml-4 text-gray-600 hover:text-gray-900 bg-red-50 p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.name}
                to={product.path}
                className="group block p-6 bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-center justify-center mb-4">
                  {product.icon}
                </div>
                <h2 className="text-xl font-semibold text-center mb-2 group-hover:text-red-600 transition-colors text-gray-800">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-center">{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
