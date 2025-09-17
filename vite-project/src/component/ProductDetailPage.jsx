import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Download, Mail, CheckCircle, Plus } from "lucide-react";
// Assuming these are correctly configured
import axiosInstance, { formatImageUrl } from "../axios/axios.config";

// This is a static navigation array. You can define it outside the component.
const NAV = [
  { id: "about", label: "About" },
  { id: "benefits", label: "Benefits" },
  { id: "specs", label: "Specs" },
  { id: "pack", label: "Packaging" },
  // { id: "certs", label: "Certifications" },
  { id: "faqs", label: "FAQs" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductDetailPage({
  _id,
  title,
  images = [],
  mainImage = null,
  description,
  faqs = [],
  benefits = [],
  specifications = {},
  packaging = [],
  certifications = [],
  videoUrl,
  datasheetUrl,
  isEditing = false
}) {
  const [active, setActive] = useState(NAV[0].id);
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [newBenefit, setNewBenefit] = useState({ title: '', description: '' });
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  // Set initial selected image to mainImage if it exists, otherwise the first image
  const initialImage = mainImage || (images.length > 0 ? images[0] : null);
  const [selectedImage, setSelectedImage] = useState(initialImage);

  // Use a second useEffect to update the main image when images prop changes
  useEffect(() => {
    const newInitialImage = mainImage || (images.length > 0 ? images[0] : null);
    setSelectedImage(newInitialImage);
  }, [mainImage, images]);

  // Handle scroll to update active nav item
  useEffect(() => {
    const onScroll = () => {
      // Create a copy of NAV to avoid direct mutation
      [...NAV].reverse().forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if the top of the section is near the top of the viewport
          if (rect.top <= 100) {
            setActive(id);
            return; // Found the active section, so we can stop
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    // Cleanup function
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };
  
  const handleNextImage = () => {
    const currentIndex = images.findIndex(img => img === selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };
  
  const handlePrevImage = () => {
    const currentIndex = images.findIndex(img => img === selectedImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  return (
    <div className="bg-[#f8f9fb] text-gray-900 w-full">
      {/* Sticky Nav + CTAs */}
      <header className="bg-white shadow z-30 border-b w-full">
        <div className="w-full mx-auto px-6 py-3 flex justify-between items-center">
          <nav className="text-sm text-gray-600 flex-1">
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
      </header>
      
      {/* Sub Navigation */}
      <nav className="bg-white shadow-sm z-20 border-b w-full">
        <div className="w-full mx-auto px-6">
          <div className="flex space-x-6 overflow-x-auto py-2">
            {NAV.map((navItem) => (
              <a
                key={navItem.id}
                href={`#${navItem.id}`}
                className={`text-sm font-medium whitespace-nowrap ${
                  active === navItem.id
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {navItem.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-white py-12 px-0">
        <div className="w-full mx-auto px-6 flex flex-col lg:flex-row gap-8">
          <div className="w-full">
            <div className="relative">
              {/* This is the corrected line */}
              <img
                src={formatImageUrl(selectedImage)}
                alt={title}
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-contain rounded-lg shadow mx-auto"
              />
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.75-11.25v5.5a.75.75 0 001.15.62l4.5-2.75a.75.75 0 000-1.24l-4.5-2.75a.75.75 0 00-1.15.62z" />
                  </svg>
                  Watch Video
                </a>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex items-center space-x-2 overflow-x-auto justify-center">
                <button
                  onClick={handlePrevImage}
                  className="p-1 sm:p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={formatImageUrl(img)}
                    alt={`${title} ${idx + 1}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg cursor-pointer border-2 ${
                      selectedImage === img
                        ? "border-red-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => handleThumbnailClick(img)}
                  />
                ))}
                <button
                  onClick={handleNextImage}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Key Benefits</h2>
            {isEditing && (
              <button
                onClick={() => setShowBenefitForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Add Benefit
              </button>
            )}
          </div>

          {showBenefitForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await axiosInstance.post(
                    `/api/products/${_id}/benefits`,
                    newBenefit
                  );
                  if (response.data.success) {
                    window.location.reload();
                    setShowBenefitForm(false);
                  }
                } catch (error) {
                  console.error('Error adding benefit:', error);
                }
              }}
              className="mb-6 bg-white p-4 rounded-lg shadow"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Benefit Title</label>
                  <input
                    type="text"
                    value={newBenefit.title}
                    onChange={(e) => setNewBenefit({ ...newBenefit, title: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newBenefit.description}
                    onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Save Benefit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBenefitForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <CheckCircle className="w-6 h-6 text-red-600 mb-2" />
                <h4 className="font-semibold mb-1">{b.title || 'Benefit'}</h4>
                <p className="text-gray-700">{b.description || 'No description available'}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

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

      {/* FAQs Section */}
      <motion.section
        id="faqs"
        className="w-full bg-[#fff] py-12 px-0"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            {isEditing && (
              <button
                onClick={() => setShowFaqForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            )}
          </div>

          {showFaqForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await axiosInstance.post(
                    `/api/products/${_id}/faqs`,
                    newFaq
                  );
                  if (response.data.success) {
                    window.location.reload();
                    setShowFaqForm(false);
                  }
                } catch (error) {
                  console.error('Error adding FAQ:', error);
                }
              }}
              className="mb-6 bg-white p-4 rounded-lg shadow"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <input
                    type="text"
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Answer</label>
                  <textarea
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Save FAQ
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFaqForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <motion.section
          id="certs"
          className="w-full bg-gradient-to-br from-gray-50 to-white py-20 px-0"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
        >
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Certifications & Compliance</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our products meet the highest industry standards and certifications
              </p>
            </div>
            <div className={`flex ${certifications.length === 1 ? 'justify-center' : 'justify-center flex-wrap'} gap-8 max-w-6xl mx-auto`}>
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-200 hover:border-blue-300 cursor-pointer transform hover:-translate-y-2"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => window.open(formatImageUrl(cert.image || cert.src), '_blank')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300 shadow-inner">
                      <img
                        src={formatImageUrl(cert.image || cert.src)}
                        alt={cert.name || cert.alt || 'Certification'}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {cert.name && (
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                        {cert.name}
                      </h3>
                    )}
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
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