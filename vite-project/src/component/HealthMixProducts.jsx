import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";
import ProductDetailPage from "./ProductDetailPage";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const HealthMixProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/category/health-mix`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching health mix products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Loading health mix products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => setSelected(null)} className="mb-6 text-sm text-green-700 hover:underline">← Back to Products</button>
          <ProductDetailPage
            title={selected.title}
            mainImage={selected.images?.[0]}
            description={selected.description}
            benefits={selected.benefits}
            specifications={selected.specifications}
            packaging={selected.packaging}
            videoUrl={selected.videoUrl}
            datasheetUrl={selected.datasheetUrl}
            certifications={selected.certifications}
            faqs={selected.faqs}
            related={selected.related}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/images/healthmix-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black/60" />
        
        <h1 className="relative z-10 text-3xl md:text-5xl font-bold uppercase text-white text-center px-4">Health Mix Products</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Explore Our Health Mixes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              No health mix products available.
            </div>
          ) : (
            products.map((prod, i) => (
              <motion.div 
                key={prod._id || prod.slug} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: i * 0.1 }} 
                viewport={{ once: true }}
              >
                <ProductCard
                  title={prod.title}
                  description={prod.shortDescription || prod.description}
                  image={prod.images?.[0]?.startsWith('http') 
                    ? prod.images[0] 
                    : `http://localhost:3001${prod.images[0]}`}
                  onLearnMore={() => setSelected(prod)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthMixProducts;
