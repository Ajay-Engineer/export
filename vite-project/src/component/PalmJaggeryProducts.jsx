import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PalmJaggeryProducts() {
  const products = [
    {
      id: 1,
      name: "Traditional Palm Jaggery",
      description: "Pure and natural palm jaggery made traditionally",
      specifications: [
        "100% natural",
        "No artificial additives",
        "Rich in iron",
        "Available in blocks and powder form"
      ],
      applications: [
        "Natural sweetener",
        "Traditional cooking",
        "Ayurvedic medicine"
      ]
    },
    {
      id: 2,
      name: "Palm Crystal Sugar",
      description: "Crystallized palm sugar with natural sweetness",
      specifications: [
        "Fine crystal texture",
        "Low glycemic index",
        "Natural brown color",
        "Multiple packaging options"
      ],
      applications: [
        "Bakery products",
        "Beverages",
        "Confectionery"
      ]
    },
    {
      id: 3,
      name: "Liquid Palm Jaggery",
      description: "Pure liquid palm jaggery for easy use",
      specifications: [
        "100% pure",
        "Easy to pour",
        "No crystallization",
        "Long shelf life"
      ],
      applications: [
        "Dessert making",
        "Beverage sweetener",
        "Food processing"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center text-red-600 hover:text-red-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Products
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-12">Palm Jaggery Products</h1>
      <div className="space-y-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Specifications:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="text-gray-600">{spec}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Applications:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.applications.map((app, index) => (
                      <li key={index} className="text-gray-600">{app}</li>
                    ))}
                  </ul>
                </div>

                <button className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Get Quote
                </button>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full h-64 bg-gray-200 rounded-lg">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Product Image
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
