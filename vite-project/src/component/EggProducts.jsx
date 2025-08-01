import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";
import ProductDetailPage from "./ProductDetailPage";

const products = [
  {
    slug: "egg-powder",
    title: "Egg Powder",
    description: "High-protein egg powder for baking and cooking.",
    images: ["/images/egg-powder.png"],
    videoUrl: "https://www.youtube.com/embed/eggpowder",
    datasheetUrl: "/datasheets/egg-powder.pdf",
    benefits: [
      { title: "High Protein", description: "Great for muscle building." },
      { title: "Long Shelf Life", description: "Stays fresh for months." },
    ],
    specifications: {
      "Source": "Hen eggs",
      Form: "Powder",
      Color: "Light yellow",
      Moisture: "< 5%",
      "Shelf Life": "12 months",
      MOQ: "500kg",
    },
    packaging: [
      { title: "Pouch", content: "500g, 1kg" },
      { title: "Bulk", content: "20kg drum" },
    ],
    certifications: [
      { src: "/certs/fssai.png", alt: "FSSAI Certified" },
    ],
    faqs: [
      { q: "Is it pasteurized?", a: "Yes, fully pasteurized." },
    ],
    related: [
      { title: "Liquid Egg", image: "/images/liquid-egg.png", link: "/products/egg/liquid-egg" },
    ],
  },
];

const EggProducts = () => {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => setSelected(null)} className="mb-6 text-sm text-yellow-700 hover:underline">← Back to Products</button>
          <ProductDetailPage
            title={selected.title}
            mainImage={selected.images?.[0] || selected.image}
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
      <div className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/images/egg-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <h1 className="relative z-10 text-3xl md:text-5xl font-bold uppercase text-white text-center px-4">Egg Products</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-12">Explore Our Egg Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((prod, i) => (
            <motion.div key={prod.slug || prod.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}>
              <ProductCard
                title={prod.title}
                description={prod.description}
                image={prod.images?.[0] || prod.image}
                onLearnMore={() => setSelected(prod)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EggProducts;
