import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../axios/axios.config";
import ProductCard from "../component/Productclass";
import ProductDetailPage from "../component/ProductDetailPage";

const ProductList = ({ category, title, description }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `/products/category/${category.toLowerCase()}`
        );

        let data = [];
        if (Array.isArray(response.data?.products)) {
          data = response.data.products;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }

        setProducts(data);
      } catch (err) {
        console.error(`Error fetching ${category} products:`, err);
        setError(`Failed to fetch ${category} products. Please try again later.`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.delete(`/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatImageUrl = (img) => {
    if (!img) return "/placeholder.jpg"; // default fallback image
    if (typeof img !== 'string') return img;
    if (img.startsWith("http")) return img;

    const baseUrl = import.meta.env.MODE === 'production'
      ? 'https://rebecca-exim-api.herokuapp.com'
      : 'http://localhost:3001';

    return img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
  };

  // Detail page
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
            mainImage={formatImageUrl(selected.images?.[0])}
            onBack={() => setSelected(null)}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Error state
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

  // No products
  if (!products.length) {
    return (
      <div className="bg-white min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
          <p className="text-gray-600 text-lg mt-6">
            No products available at the moment.
          </p>
        </div>
      </div>
    );
  }

  // Product grid
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
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
                description={product.description}
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
