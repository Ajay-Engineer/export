import { useParams, useNavigate, Link } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import {
  Leaf,
  CakeSlice,
  Flower2,
  Coffee,
  HeartPulse,
  Hand,
  Egg,
} from "lucide-react";

export default function ProductCategory() {
  const { category } = useParams();
  const navigate = useNavigate();

  const productCategories = {
    "herbal": {
      name: "Herbal Extract Products",
      icon: <Leaf className="w-12 h-12 text-red-600" />,
      description:
        "Our herbal extract products are carefully sourced and processed to maintain their natural properties and benefits.",
      products: [
        "Turmeric Extract",
        "Neem Extract",
        "Moringa Extract",
        "Aloe Vera Extract",
      ],
    },
    "palm-jaggery": {
      name: "Palm Jaggery Products",
      icon: <CakeSlice className="w-12 h-12 text-red-600" />,
      description:
        "Traditional palm jaggery products made using time-tested methods for authentic taste and quality.",
      products: ["Palm Sugar", "Palm Candy", "Palm Nectar", "Organic Jaggery"],
    },
    coir: {
      name: "Coir Products",
      icon: <Flower2 className="w-12 h-12 text-red-600" />,
      description:
        "Eco-friendly coir products made from coconut husks, perfect for various applications.",
      products: ["Coir Mats", "Coir Ropes", "Coir Pith", "Coir Geotextiles"],
    },
    tea: {
      name: "Tea Varieties",
      icon: <Coffee className="w-12 h-12 text-red-600" />,
      description:
        "Premium tea varieties sourced from the finest gardens, offering unique flavors and aromas.",
      products: ["Black Tea", "Green Tea", "White Tea", "Herbal Tea Blends"],
    },
    "health-mix": {
      name: "Health Mix Products",
      icon: <HeartPulse className="w-12 h-12 text-red-600" />,
      description:
        "Nutritious health mix products designed to support your daily wellness routine.",
      products: [
        "Multi-grain Mix",
        "Protein Mix",
        "Energy Mix",
        "Immunity Booster Mix",
      ],
    },
    handicrafts: {
      name: "Handicrafts",
      icon: <Hand className="w-12 h-12 text-red-600" />,
      description:
        "Beautiful handcrafted products made by skilled artisans using traditional techniques.",
      products: [
        "Wooden Crafts",
        "Textile Handicrafts",
        "Metal Crafts",
        "Bamboo Products",
      ],
    },
    egg: {
      name: "Egg Products",
      icon: <Egg className="w-12 h-12 text-red-600" />,
      description:
        "High-quality egg products processed and packaged with the utmost care.",
      products: ["Egg Powder", "Liquid Egg", "Egg White Protein", "Egg Yolk Oil"],
    },
  };

  const categoryData = productCategories[category];

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Navigation Header - Fixed Position */}
          <div className="bg-white shadow-sm rounded-lg p-4 mb-8 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium bg-red-50 px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors bg-white border border-gray-200"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Product Category Not Found
            </h1>
            <p className="text-gray-600">The requested category could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Header - Fixed Position */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-8 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium bg-red-50 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-2xl font-bold text-red-600">Back to Home</span>
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors bg-white border border-gray-200"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">{categoryData.icon}</div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{categoryData.name}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {categoryData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryData.products.map((product) => (
              <div
                key={product}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{product}</h3>
                <button className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-full font-medium">
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
