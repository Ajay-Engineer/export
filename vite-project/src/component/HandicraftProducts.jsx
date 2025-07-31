
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";

const products = [
  {
    title: "Handwoven Textiles",
    description: "Traditional handloom textiles with unique designs.",
    image: "/images/handwoven-textiles.png",
    link: "/products/handicraft/handwoven-textiles",
  },
  {
    title: "Wooden Artifacts",
    description: "Handcrafted wooden items with intricate designs.",
    image: "/images/wooden-artifacts.png",
    link: "/products/handicraft/wooden-artifacts",
  },
  {
    title: "Metal Crafts",
    description: "Traditional metal crafts with modern appeal.",
    image: "/images/metal-crafts.png",
    link: "/products/handicraft/metal-crafts",
  },
  {
    title: "Terracotta Pottery",
    description: "Handmade terracotta pottery for home and garden.",
    image: "/images/terracotta-pottery.png",
    link: "/products/handicraft/terracotta-pottery",
  },
  {
    title: "Bamboo Crafts",
    description: "Eco-friendly bamboo crafts for sustainable living.",
    image: "/images/bamboo-crafts.png",
    link: "/products/handicraft/bamboo-crafts",
  },
  {
    title: "Jute Bags",
    description: "Stylish and durable jute bags for everyday use.",
    image: "/images/jute-bags.png",
    link: "/products/handicraft/jute-bags",
  },
];

const HandicraftProducts = () => {
  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div
        className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/handicraft-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Handicraft Products
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-12">
          Explore Our Handicraft Range
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard
                title={product.title}
                description={product.description}
                image={product.image}
                link={product.link}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandicraftProducts;
