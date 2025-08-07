

import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";
import ProductDetailPage from "./ProductDetailPage";

const products = [
  {
    slug: "multi-grain-health-mix",
    title: "Multi-Grain Health Mix",
    description: "Nutritious blend of multiple grains and pulses.",
    images: ["/images/multigrain-health-mix.png"],
    videoUrl: "https://www.youtube.com/embed/multigrainmix",
    datasheetUrl: "/datasheets/multigrain-health-mix.pdf",
    benefits: [
      { title: "Rich in Fiber", description: "Supports digestion." },
      { title: "Balanced Nutrition", description: "Essential vitamins and minerals." },
    ],
    specifications: {
      Ingredients: "Wheat, Ragi, Green gram, etc.",
      Form: "Powder",
      Color: "Brown",
      Moisture: "< 8%",
      "Shelf Life": "12 months",
      MOQ: "200kg",
    },
    packaging: [
      { title: "Pouch", content: "500g, 1kg" },
    ],
    certifications: [
      { src: "/certs/fssai.png", alt: "FSSAI Certified" },
    ],
    faqs: [
      { q: "Is it gluten-free?", a: "No, contains wheat." },
    ],
    related: [
      { title: "Protein Power Mix", image: "/images/protein-power-mix.png", link: "/products/health-mix/protein-power" },
    ],
  },
  // ...add more dummy health mix products here with all fields...
];

const HealthMixProducts = () => {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => setSelected(null)} className="mb-6 text-sm text-green-700 hover:underline">← Back to Products</button>
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
      <div className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/images/healthmix-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <h1 className="relative z-10 text-3xl md:text-5xl font-bold uppercase text-white text-center px-4">Health Mix Products</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Explore Our Health Mixes</h2>
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

export default HealthMixProducts;
