import { Link } from "react-router-dom";
import {
  Leaf,
  CakeSlice,
  Flower2,
  Coffee,
  HeartPulse,
  Hand,
  Egg,
} from "lucide-react";

export default function ProductsPage() {
  const products = [
    {
      name: "Herbal Extract Products",
      path: "/products/herbal",
      icon: <Leaf className="w-8 h-8 text-red-600" />,
      description: "Natural herbal extracts for health and wellness",
    },
    {
      name: "Palm Jaggery Products",
      path: "/products/palm-jaggery",
      icon: <CakeSlice className="w-8 h-8 text-red-600" />,
      description: "Traditional and healthy palm jaggery products",
    },
    {
      name: "Coir Products",
      path: "/products/coir",
      icon: <Flower2 className="w-8 h-8 text-red-600" />,
      description: "Eco-friendly coir-based products",
    },
    {
      name: "Tea Varieties",
      path: "/products/tea",
      icon: <Coffee className="w-8 h-8 text-red-600" />,
      description: "Premium tea varieties from the finest gardens",
    },
    {
      name: "Health Mix",
      path: "/products/health-mix",
      icon: <HeartPulse className="w-8 h-8 text-red-600" />,
      description: "Nutritious health mix products for daily wellness",
    },
    {
      name: "Handicrafts",
      path: "/products/handicraft",
      icon: <Hand className="w-8 h-8 text-red-600" />,
      description: "Beautiful handcrafted products",
    },
    {
      name: "Egg Products",
      path: "/products/egg",
      icon: <Egg className="w-8 h-8 text-red-600" />,
      description: "Quality egg products",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Top quick navigation bar */}
      <h1 className="text-4xl font-bold text-center mb-12">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.name}
            to={product.path}
            className="group block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center mb-4">
              {product.icon}
            </div>
            <h2 className="text-xl font-semibold text-center mb-2 group-hover:text-red-600 transition-colors">
              {product.name}
            </h2>
            <p className="text-gray-600 text-center">{product.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
