
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";

const products = [
  {
    title: "Coir Geo Textiles",
    description: "Eco-friendly geotextiles for soil erosion control.",
    image: "/images/coir-geo-textiles.png",
    link: "/products/coir/geo-textiles",
  },
  {
    title: "Coir Mattresses",
    description: "Natural coir fiber mattresses for optimal comfort.",
    image: "/images/coir-mattresses.png",
    link: "/products/coir/mattresses",
  },
  {
    title: "Coir Pith Blocks",
    description: "Compressed coir pith blocks for agricultural use.",
    image: "/images/coir-pith-blocks.png",
    link: "/products/coir/pith-blocks",
  },
  {
    title: "Coir Rope",
    description: "Durable coir rope for gardening and packaging.",
    image: "/images/coir-rope.png",
    link: "/products/coir/rope",
  },
  {
    title: "Coir Mats",
    description: "Natural coir mats for home and industrial use.",
    image: "/images/coir-mats.png",
    link: "/products/coir/mats",
  },
  {
    title: "Coir Logs",
    description: "Biodegradable coir logs for erosion control.",
    image: "/images/coir-logs.png",
    link: "/products/coir/logs",
  },
];

const CoirProducts = () => {
  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div
        className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/coir-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Coir Products
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-12">
          Explore Our Coir Range
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

export default CoirProducts;
