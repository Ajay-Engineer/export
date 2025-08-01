

import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";
import ProductDetailPage from "./ProductDetailPage";

const products = [
  {
    slug: "coir-geo-textiles",
    title: "Coir Geo Textiles",
    description: "Eco-friendly geotextiles for soil erosion control.",
    images: ["/images/coir-geo-textiles.png"],
    videoUrl: "https://www.youtube.com/embed/coirgeo",
    datasheetUrl: "/datasheets/coir-geo-textiles.pdf",
    benefits: [
      { title: "Erosion Control", description: "Prevents soil loss." },
      { title: "Biodegradable", description: "Eco-friendly material." },
    ],
    specifications: {
      Material: "Coir",
      Size: "2x50m",
      Color: "Brown",
      MOQ: "100 rolls",
    },
    packaging: [
      { title: "Roll", content: "2x50m" },
    ],
    certifications: [
      { src: "/certs/organic.png", alt: "Organic" },
    ],
    faqs: [
      { q: "Is it biodegradable?", a: "Yes, 100%." },
    ],
    related: [
      { title: "Coir Mats", image: "/images/coir-mats.png", link: "/products/coir/mats" },
    ],
  },
  // ...add more dummy coir products here with all fields...
];

const CoirProducts = () => {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => setSelected(null)} className="mb-6 text-sm text-yellow-700 hover:underline">← Back to Products</button>
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
      <div className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/images/coir-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <h1 className="relative z-10 text-3xl md:text-5xl font-bold uppercase text-white text-center px-4">Coir Products</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-12">Explore Our Coir Range</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((prod, i) => (
            <motion.div key={prod.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}>
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

export default CoirProducts;
