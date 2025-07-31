// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

class ProductCard extends React.Component {
  render() {
    const { title, description, image, link, index } = this.props;

    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <div className="overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-[160px] object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-5 text-center">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <Link
            to={link}
            className="inline-block mt-4 bg-red-700 hover:bg-red-800 text-white text-sm px-5 py-2 rounded-full transition duration-300"
          >
            LEARN MORE
          </Link>
        </div>
      </motion.div>
    );
  }
}

export default ProductCard;
