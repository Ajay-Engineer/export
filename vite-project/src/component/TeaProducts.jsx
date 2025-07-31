
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";

const products = [
  {
    title: "Premium Black Tea",
    description: "Fine quality black tea from selected estates.",
    image: "/images/premium-black-tea.png",
    link: "/products/tea/premium-black",
  },
  {
    title: "Green Tea",
    description: "Unfermented green tea with natural benefits.",
    image: "/images/green-tea.png",
    link: "/products/tea/green",
  },
  {
    title: "Specialty Tea Blends",
    description: "Custom tea blends with unique flavors.",
    image: "/images/specialty-tea-blends.png",
    link: "/products/tea/specialty-blends",
  },
  {
    title: "Herbal Infusions",
    description: "Aromatic herbal infusions for wellness.",
    image: "/images/herbal-infusions.png",
    link: "/products/tea/herbal-infusions",
  },
  {
    title: "Masala Chai",
    description: "Spiced tea blend for a traditional taste.",
    image: "/images/masala-chai.png",
    link: "/products/tea/masala-chai",
  },
  {
    title: "White Tea",
    description: "Delicate white tea with subtle flavor.",
    image: "/images/white-tea.png",
    link: "/products/tea/white",
  },
];

const TeaProducts = () => {
  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div
        className="relative h-[260px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/tea-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            Tea Varieties
          </h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
          Explore Our Tea Selection
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

export default TeaProducts;
