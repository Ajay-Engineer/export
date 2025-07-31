
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";

const products = [
  {
    title: "Turmeric Extract",
    description: "Pure turmeric extract with high curcumin content.",
    image: "/images/turmeric-extract.png",
    link: "/products/herbal/turmeric-extract",
  },
  {
    title: "Moringa Extract",
    description: "Natural moringa leaf extract rich in nutrients.",
    image: "/images/moringa-extract.png",
    link: "/products/herbal/moringa-extract",
  },
  {
    title: "Neem Extract",
    description: "Premium neem extract with natural benefits.",
    image: "/images/neem-extract.png",
    link: "/products/herbal/neem-extract",
  },
  {
    title: "Amla Powder",
    description: "Rich in Vitamin C, supports immunity and digestion.",
    image: "/images/amla-powder.png",
    link: "/products/herbal/amla-powder",
  },
  {
    title: "Ashwagandha Root",
    description: "Adaptogenic herb for stress relief and vitality.",
    image: "/images/ashwagandha-root.png",
    link: "/products/herbal/ashwagandha-root",
  },
  {
    title: "Tulsi Leaves",
    description: "Holy basil leaves for respiratory and immune support.",
    image: "/images/tulsi-leaves.png",
    link: "/products/herbal/tulsi-leaves",
  },
  {
    title: "Brahmi Extract",
    description: "Supports cognitive function and mental clarity.",
    image: "/images/brahmi-extract.png",
    link: "/products/herbal/brahmi-extract",
  },
  {
    title: "Shatavari Powder",
    description: "Traditional herb for women's health and wellness.",
    image: "/images/shatavari-powder.png",
    link: "/products/herbal/shatavari-powder",
  },
];

const HerbalProducts = () => {
  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div
        className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/herbal-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Herbal Products
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
          Explore Our Herbal Extracts
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

export default HerbalProducts;
