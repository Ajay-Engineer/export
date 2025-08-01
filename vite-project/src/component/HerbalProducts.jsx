

import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";
import ProductDetailPage from "./ProductDetailPage";

const products = [
  {
    slug: "turmeric-extract",
    title: "Turmeric Extract",
    description: "Pure turmeric extract with high curcumin content.",
    images: ["/images/turmeric-extract.png"],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    datasheetUrl: "/datasheets/turmeric-extract.pdf",
    benefits: [
      { title: "High Curcumin", description: "95% curcumin content." },
      { title: "Organic", description: "Certified organic product." },
    ],
    specifications: {
      "Botanical Source": "Curcuma longa",
      Form: "Powder",
      Color: "Yellow",
      Moisture: "< 8%",
      "Ash Content": "< 5%",
      "Shelf Life": "24 months",
      pH: "5.5–6.5",
      MOQ: "100kg",
    },
    packaging: [
      { title: "Pouch", content: "100g, 250g, 1kg" },
      { title: "Bulk", content: "25kg drum" },
    ],
    certifications: [
      { src: "/certs/organic.png", alt: "Organic" },
      { src: "/certs/fssai.png", alt: "FSSAI Certified" },
    ],
    faqs: [
      { q: "Is it organic?", a: "Yes, certified." },
      { q: "How to store?", a: "Cool, dry place." },
    ],
    related: [
      { title: "Moringa Extract", image: "/images/moringa-extract.png", link: "/products/herbal/moringa-extract" },
    ],
  },
  {
    slug: "moringa-extract",
    title: "Moringa Extract",
    description: "Natural moringa leaf extract rich in nutrients.",
    images: ["/images/moringa-extract.png"],
    videoUrl: "https://www.youtube.com/embed/2vjPBrBU-TM",
    datasheetUrl: "/datasheets/moringa-extract.pdf",
    benefits: [
      { title: "Nutrient Rich", description: "Vitamins and minerals." },
    ],
    specifications: {
      "Botanical Source": "Moringa oleifera",
      Form: "Powder",
      Color: "Green",
      Moisture: "< 7%",
      "Ash Content": "< 4%",
      "Shelf Life": "18 months",
      pH: "6.0–7.0",
      MOQ: "100kg",
    },
    packaging: [
      { title: "Pouch", content: "100g, 250g, 1kg" },
    ],
    certifications: [
      { src: "/certs/organic.png", alt: "Organic" } 
    ],
    faqs: [
      { q: "Is it organic?", a: "Yes, certified." },
    ],
    related: [
      { title: "Turmeric Extract", image: "/images/turmeric-extract.png", link: "/products/herbal/turmeric-extract" },
    ],
  },
  // ...add more dummy herbal products here with all fields...
];

const HerbalProducts = () => {
  const [selected, setSelected] = useState(null);

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
      <div
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/herbal-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <h1 className="relative z-10 text-3xl md:text-5xl font-bold uppercase text-white text-center px-4">
          Herbal Products
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
          Explore Our Herbal Extracts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((prod, i) => (
            <motion.div
              key={prod.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard
                title={prod.title}
                description={prod.description}
                image={prod.images?.[0]}
                onLearnMore={() => setSelected(prod)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HerbalProducts;
