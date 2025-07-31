
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";

const products = [
  {
    title: "Egg Albumen Powder",
    description: "High-quality dried egg white powder.",
    image: "/images/egg-albumen-powder.png",
    link: "/products/egg/albumen-powder",
  },
  {
    title: "Liquid Whole Egg",
    description: "Pasteurized liquid whole egg.",
    image: "/images/liquid-whole-egg.png",
    link: "/products/egg/liquid-whole-egg",
  },
  {
    title: "Egg Yolk Oil",
    description: "Pure egg yolk oil for cosmetic and nutritional use.",
    image: "/images/egg-yolk-oil.png",
    link: "/products/egg/yolk-oil",
  },
  {
    title: "Egg Shell Powder",
    description: "Calcium-rich powder for supplements and food use.",
    image: "/images/egg-shell-powder.png",
    link: "/products/egg/shell-powder",
  },
  {
    title: "Egg Protein Bars",
    description: "Nutritious bars for athletes and health enthusiasts.",
    image: "/images/egg-protein-bars.png",
    link: "/products/egg/protein-bars",
  },
  {
    title: "Egg Mayonnaise",
    description: "Creamy mayonnaise made from fresh eggs.",
    image: "/images/egg-mayonnaise.png",
    link: "/products/egg/mayonnaise",
  },
];

const EggProducts = () => {
  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div
        className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/egg-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Egg Products
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-12">
          Explore Our Egg Range
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

export default EggProducts;
