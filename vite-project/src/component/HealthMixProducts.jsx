
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";

const products = [
  {
    title: "Multi-Grain Health Mix",
    description: "Nutritious blend of multiple grains and pulses.",
    image: "/images/multigrain-health-mix.png",
    link: "/products/health-mix/multigrain",
  },
  {
    title: "Protein Power Mix",
    description: "High-protein blend for active lifestyle.",
    image: "/images/protein-power-mix.png",
    link: "/products/health-mix/protein-power",
  },
  {
    title: "Kids Health Mix",
    description: "Specially formulated mix for growing children.",
    image: "/images/kids-health-mix.png",
    link: "/products/health-mix/kids",
  },
  {
    title: "Diabetic Health Mix",
    description: "Low glycemic blend for diabetic wellness.",
    image: "/images/diabetic-health-mix.png",
    link: "/products/health-mix/diabetic",
  },
  {
    title: "Women’s Wellness Mix",
    description: "Specially crafted for women’s health needs.",
    image: "/images/womens-wellness-mix.png",
    link: "/products/health-mix/womens-wellness",
  },
  {
    title: "Senior Nutrition Mix",
    description: "Balanced nutrition for seniors.",
    image: "/images/senior-nutrition-mix.png",
    link: "/products/health-mix/senior-nutrition",
  },
];

const HealthMixProducts = () => {
  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div
        className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/healthmix-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Health Mix Products
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
          Explore Our Health Mixes
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

export default HealthMixProducts;
