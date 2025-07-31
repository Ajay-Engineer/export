import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";

const products = [
  {
    title: "Palm Jaggery Powder",
    description: "Easy to use as a natural sweetener for tea, coffee, and desserts.",
    image: "/images/jaggery-powder.png",
    link: "/products/palm-jaggery-powder",
  },
  {
    title: "Palm Jaggery Balls (Karupatti Urundai)",
    description: "Small bite-sized balls used as energy boosters and digestive aids.",
    image: "/images/jaggery-balls.png",
    link: "/products/palm-jaggery-balls",
  },
  {
    title: "Palm Jaggery Syrup (Karupatti Pani)",
    description: "Liquid form used in traditional sweets, pancakes, and herbal drinks.",
    image: "/images/jaggery-syrup.png",
    link: "/products/palm-jaggery-syrup",
  },
  {
    title: "Palm Jaggery Candy (Karupatti Mittai)",
    description: "Healthy candy alternative, especially for kids.",
    image: "/images/jaggery-candy.png",
    link: "/products/palm-jaggery-candy",
  },
  {
    title: "Palm Jaggery Cubes/Blocks",
    description: "Traditional form used in cooking, coffee, or direct consumption.",
    image: "/images/jaggery-cubes.png",
    link: "/products/palm-jaggery-cubes",
  },
  {
    title: "Palm Jaggery Chocolate",
    description: "Fusion product combining palm jaggery and cocoa for a healthy treat.",
    image: "/images/jaggery-chocolate.png",
    link: "/products/palm-jaggery-chocolate",
  },
];

const PalmJaggeryProducts = () => {
  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div
        className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/jaggery-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Palm Jaggery Products
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-12">
          Explore Our Natural Sweeteners
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

export default PalmJaggeryProducts;
