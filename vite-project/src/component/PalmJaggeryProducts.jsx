import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./Productclass";          // renamed from Productclass
import ProductDetailPage from "./ProductDetailPage";
import jaggery from "../assets/Rebecca_Hom_image_2.png"

const products = [
  {
    slug: "palm-jaggery-powder",
    title: "Palm Jaggery Powder",
    description: `Our premium-grade Palm Jaggery Powder is sourced from
certified organic palm trees. Naturally free-flowing, it’s perfect
for sweetening beverages, baking, and traditional recipes.`,
    images: [
      "/images/jaggery-powder-main.jpg",
      "/images/jaggery-powder-side.jpg",
      "/images/jaggery-powder-pack.jpg",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    datasheetUrl: "/datasheets/palm-jaggery-powder.pdf",
    benefits: [
      { title: "Natural Sweetener", description: "Free from chemicals and additives." },
      { title: "Rich in Iron", description: "Helps maintain healthy hemoglobin." },
      { title: "Low GI Index", description: "Gentler on blood sugar levels." },
    ],
    specifications: {
      "Botanical Source": "Phoenix sylvestris",
      Form: "Fine powder",
      Color: "Dark amber",
      Moisture: "< 5%",
      "Ash Content": "< 3%",
      "Shelf Life": "12 months",
      pH: "5.5–6.5",
      MOQ: "1 MT (negotiable)",
    },
    packaging: [
      { title: "Retail Pack", content: "250g, 500g & 1kg vacuum-sealed pouches" },
      { title: "Bulk Pack", content: "20kg HDPE-lined sacks" },
      { title: "Custom Label", content: "Private-label available on request" },
    ],
    certifications: [
      { src: "/certs/fssai.png", alt: "FSSAI Certified" },
      { src: "/certs/iso22000.png", alt: "ISO 22000 Certified" },
      { src: "/certs/usda-organic.png", alt: "USDA Organic" },
    ],
    faqs: [
      { q: "Is this product GMO-free?", a: "Yes—100% non-GMO." },
      { q: "How to store?", a: "Cool, dry place away from sunlight." },
      { q: "Samples available?", a: "Yes, contact sales." },
    ],
    related: [
      {
        title: "Palm Jaggery Blocks",
        image: "/images/jaggery-blocks.jpg",
        link: "/products/palm-jaggery-blocks",
      },
      {
        title: "Palm Jaggery Syrup",
        image: "/images/jaggery-syrup.jpg",
        link: "/products/palm-jaggery-syrup",
      },
    ],
  },
  // …add additional products here…
];


const PalmJaggeryProducts = () => {
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
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Banner */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/jaggery-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <h1 className="relative z-10 text-3xl md:text-5xl font-bold uppercase text-white text-center px-4">
          Palm Jaggery Products
        </h1>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-12">
          Explore Our Natural Sweeteners
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

export default PalmJaggeryProducts;
