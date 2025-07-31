import { useParams } from "react-router-dom";
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-red-600">
          Product Category Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">{categoryData.icon}</div>
        <h1 className="text-4xl font-bold mb-4">{categoryData.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {categoryData.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categoryData.products.map((product) => (
          <div
            key={product}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{product}</h3>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full">
              Get Quote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
