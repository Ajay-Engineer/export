import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance, { formatImageUrl } from "../axios/axios.config";
import { useNavigate } from "react-router-dom";
import ProductCard from "./Productclass";
import ProductDetailPage from "./ProductDetailPage";

const ProductList = ({ category, title, description }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`products/category/${category}`);
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setError('Invalid data received from server');
        }
      } catch (err) {
        setError(`Failed to fetch ${category} products. Please try again later.`);
        console.error(`Error fetching ${category} products:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (selected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => setSelected(null)}
            className="mb-6 text-sm text-red-700 hover:underline"
          >
            ← Back to Products
          </button>

          <ProductDetailPage
            {...selected}
            mainImage={selected.images?.[0]}
            certifications={selected.certifications || []}
            onBack={() => setSelected(null)}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-lg text-gray-600">{description}</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Products Grid Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id || product.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard
                title={product.name || product.title}
                shortDescription={product.shortDescription || ''}
                image={formatImageUrl(product.images?.[0])}
                onLearnMore={() => setSelected(product)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductList;
