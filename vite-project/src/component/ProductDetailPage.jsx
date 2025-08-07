import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Mail, CheckCircle } from "lucide-react";

const NAV = [
  { id: "about", label: "About" },
  { id: "benefits", label: "Benefits" },
  { id: "specs", label: "Specs" },
  { id: "pack", label: "Packaging" },
  { id: "certs", label: "Certifications" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductDetailPage({
  title,
  images = [],
  description,
  benefits = [],
  specifications = {},
  packaging = [],
  certifications = [],
  videoUrl,
  datasheetUrl,
}) {
  const [active, setActive] = useState(NAV[0].id);

  useEffect(() => {
    const onScroll = () => {
      NAV.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top < 150 && top > -el.offsetHeight + 150) setActive(id);
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <div className="bg-[#f8f9fb] text-gray-900 w-full">
      {/* Sticky Nav + CTAs */}
      <div className="sticky top-0 bg-white shadow z-30 border-b w-full">
        <div className="w-full max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <nav className="text-sm text-gray-600">
            <a href="/" className="hover:underline">Home</a> /{" "}
            <a href="/products" className="hover:underline">Products</a> /{" "}
            <span className="font-medium">{title}</span>
          </nav>
          <div className="flex gap-3">
            {datasheetUrl && (
              <a
                href={datasheetUrl}
                download
                className="flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <Download className="w-4 h-4 mr-2" /> Datasheet
              </a>
            )}
          </div>
        </div>
        <div className="w-full max-w-[1440px] mx-auto px-6">
          <div className="flex space-x-6 overflow-x-auto py-2">
            {NAV.map((nav) => (
              <a
                key={nav.id}
                href={`#${nav.id}`}
                className={`text-sm font-medium whitespace-nowrap ${
                  active === nav.id
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {nav.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full px-0 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.length > 0 && (
          <motion.img
            src={images[0]}
            alt={title}
            className="w-full h-[400px] object-cover rounded-lg shadow-md"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          />
        )}
        {videoUrl && (
          <motion.div
            className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <iframe
              src={videoUrl}
              title="Product Video"
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
            />
          </motion.div>
        )}
      </section>

      {/* About */}
      <motion.section
        id="about"
        className="w-full bg-white py-12 px-0"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-4">About {title}</h2>
          <p className="text-gray-700 text-lg">{description}</p>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section
        id="benefits"
        className="w-full bg-[#f2f4f8] py-12 px-0"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <CheckCircle className="w-6 h-6 text-red-600 mb-2" />
                <h4 className="font-semibold mb-1">{b.title}</h4>
                <p className="text-gray-700">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Specs */}
      <motion.section
        id="specs"
        className="w-full bg-white py-12 px-0"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6">Product Specifications</h2>
          <table className="w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <tbody>
              {Object.entries(specifications).map(([label, val], idx) => (
                <tr
                  key={label}
                  className={idx % 2 === 0 ? "bg-[#f8f9fb]" : "bg-white"}
                >
                  <th className="text-left px-4 py-3 font-medium border-r border-gray-200 bg-[#f2f4f8] text-gray-800">
                    {label}
                  </th>
                  <td className="px-4 py-3 text-gray-900">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Packaging */}
      <motion.section
        id="pack"
        className="w-full bg-[#f9fafa] py-12 px-0"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6">Packaging Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {packaging.map((pkg, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h4 className="font-semibold mb-2">{pkg.title}</h4>
                <p className="text-gray-700">{pkg.content}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Certifications */}
      {certifications.length > 0 && (
        <motion.section
          id="certs"
          className="w-full bg-white py-12 px-0"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
        >
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-6">Certifications</h2>
            <div className="flex gap-6 overflow-x-auto snap-x pb-4">
              {certifications.map((c, i) => (
                <div key={i} className="snap-center flex-shrink-0">
                  <img
                    src={c.src}
                    alt={c.alt}
                    className="h-16 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Contact CTA */}
      <section
        id="contact"
        className="w-full bg-red-50 py-16 px-0 text-center"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-red-700 mb-4">
            Ready to get a quote for {title}?
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            Contact our sales team and we’ll get back to you with a quote shortly.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <Mail className="w-5 h-5 mr-2" /> Contact Our Sales Team
          </a>
        </div>
      </section>
    </div>
  );
}
