import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductSubcategory() {
  const { category } = useParams();

  const productDetails = {
    "herbal-extract": {
      title: "Herbal Extract Products",
      products: [
        {
          id: 1,
          name: "Turmeric Extract",
          description: "Pure turmeric extract with high curcumin content",
          specifications: [
            "Curcumin content: 95%",
            "Organic certified",
            "Available in powder form",
            "Various pack sizes"
          ],
          applications: [
            "Dietary supplements",
            "Food coloring",
            "Medicinal purposes"
          ],
          image: "/herbal-extract-1.jpg"
        },
        {
          id: 2,
          name: "Moringa Extract",
          description: "Natural moringa leaf extract rich in nutrients",
          specifications: [
            "100% pure moringa extract",
            "Rich in vitamins and minerals",
            "Available in powder and liquid form",
            "Standardized composition"
          ],
          applications: [
            "Health supplements",
            "Nutritional products",
            "Natural medicine"
          ],
          image: "/moringa-extract.jpg"
        }
      ]
    },
    "palm-jaggery": {
      title: "Palm Jaggery Products",
      products: [
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
          ],
          image: "/palm-jaggery-1.jpg"
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
          ],
          image: "/palm-crystal.jpg"
        }
      ]
    },
    "coir": {
      title: "Coir Products",
      products: [
        {
          id: 1,
          name: "Coir Geo Textiles",
          description: "Eco-friendly geotextiles for soil erosion control",
          specifications: [
            "100% natural coir fiber",
            "Various densities available",
            "UV resistant",
            "Biodegradable"
          ],
          applications: [
            "Soil erosion control",
            "River bank protection",
            "Landscaping"
          ],
          image: "/coir-geo.jpg"
        },
        {
          id: 2,
          name: "Coir Mattresses",
          description: "Natural coir fiber mattresses for optimal comfort",
          specifications: [
            "100% natural filling",
            "Multiple thickness options",
            "Rubberized coir technology",
            "Custom sizes available"
          ],
          applications: [
            "Home furniture",
            "Hotel industry",
            "Healthcare facilities"
          ],
          image: "/coir-mattress.jpg"
        }
      ]
    },
    "tea": {
      title: "Tea Varieties",
      products: [
        {
          id: 1,
          name: "Premium Black Tea",
          description: "Fine quality black tea from selected estates",
          specifications: [
            "Orthodox processing",
            "Full leaf grade",
            "Rich aroma",
            "Multiple pack sizes"
          ],
          applications: [
            "Direct consumption",
            "Tea blending",
            "Iced tea preparation"
          ],
          image: "/black-tea.jpg"
        },
        {
          id: 2,
          name: "Green Tea",
          description: "Unfermented green tea with natural benefits",
          specifications: [
            "Early spring harvest",
            "Minimal processing",
            "High antioxidant content",
            "Vacuum packed"
          ],
          applications: [
            "Health beverages",
            "Weight management",
            "Wellness products"
          ],
          image: "/green-tea.jpg"
        }
      ]
    },
    "health-mix": {
      title: "Health Mix Products",
      products: [
        {
          id: 1,
          name: "Multi-Grain Health Mix",
          description: "Nutritious blend of multiple grains and pulses",
          specifications: [
            "Contains 7 grains",
            "No preservatives",
            "Rich in protein",
            "Ready to cook"
          ],
          applications: [
            "Breakfast porridge",
            "Health drink",
            "Dietary supplement"
          ],
          image: "/health-mix-1.jpg"
        },
        {
          id: 2,
          name: "Protein Power Mix",
          description: "High-protein blend for active lifestyle",
          specifications: [
            "30g protein per serving",
            "Natural ingredients",
            "Easy to digest",
            "Multiple flavors"
          ],
          applications: [
            "Post-workout nutrition",
            "Meal replacement",
            "Weight management"
          ],
          image: "/protein-mix.jpg"
        }
      ]
    },
    "handicrafts": {
      title: "Handicrafts",
      products: [
        {
          id: 1,
          name: "Handwoven Textiles",
          description: "Traditional handloom textiles with unique designs",
          specifications: [
            "100% cotton",
            "Natural dyes",
            "Traditional patterns",
            "Custom designs available"
          ],
          applications: [
            "Home decor",
            "Fashion",
            "Gift items"
          ],
          image: "/handloom-1.jpg"
        },
        {
          id: 2,
          name: "Wooden Artifacts",
          description: "Handcrafted wooden items with intricate designs",
          specifications: [
            "Sustainable wood",
            "Hand-carved",
            "Multiple finishes",
            "Customizable"
          ],
          applications: [
            "Home decoration",
            "Corporate gifts",
            "Collection pieces"
          ],
          image: "/wooden-craft.jpg"
        }
      ]
    },
    "egg": {
      title: "Egg Products",
      products: [
        {
          id: 1,
          name: "Egg Albumen Powder",
          description: "High-quality dried egg white powder",
          specifications: [
            "80% protein content",
            "Pasteurized",
            "Long shelf life",
            "Multiple pack sizes"
          ],
          applications: [
            "Bakery industry",
            "Protein supplements",
            "Food processing"
          ],
          image: "/egg-powder.jpg"
        },
        {
          id: 2,
          name: "Liquid Whole Egg",
          description: "Pasteurized liquid whole egg",
          specifications: [
            "HACCP certified",
            "No preservatives",
            "Chilled storage",
            "Bulk packaging available"
          ],
          applications: [
            "Commercial bakeries",
            "Food service industry",
            "Restaurant chains"
          ],
          image: "/liquid-egg.jpg"
        },
        {
          id: 3,
          name: "Egg Yolk Oil",
          description: "Pure egg yolk oil for cosmetic and nutritional use",
          specifications: [
            "Cold pressed",
            "Rich in vitamins",
            "Natural preservation",
            "Premium quality"
          ],
          applications: [
            "Cosmetic industry",
            "Nutritional supplements",
            "Personal care products"
          ],
          image: "/egg-oil.jpg"
        }
      ]
    }
  };

  const categoryProducts = productDetails[category];

  if (!categoryProducts) {
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
      <div className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center text-red-600 hover:text-red-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Products
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-12">{categoryProducts.title}</h1>
      <div className="space-y-12">
        {categoryProducts.products.map((product) => (
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
                  {/* Placeholder for product image */}
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
