import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoPlaceholder from "../assets/rebeccaexim_logo.png"
// Placeholder for the logo image. In a real application, you'd host this image.

const products = [
  "Herbal Extract Products",
  "Palm Jaggery Products",
  "Coir Products",
  "Tea Varieties",
  "Health Mix",
  "Handicrafts",
  "Egg Products",
];

// A component for the animated background shapes
const AnimatedShape = ({ className, delay }) => (
  <div
    className={`absolute rounded-full filter blur-3xl opacity-30 animate-blob ${className}`}
    style={{ animationDelay: `${delay}ms` }} // Apply animation delay via style
  ></div>
);

// Custom Modal Component for messages
const MessageModal = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div className={`rounded-lg shadow-xl p-6 max-w-sm w-full ${bgColor} ${textColor} text-center`}>
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [formData, setFormData] = useState({
    organization: '',
    name: '',
    designation: '',
    product: '',
    variant: '',
    email: '',
    mobile: '',
    country: '',
    quantity: '',
    time: '',
  });

  const [modal, setModal] = useState({
    isVisible: false,
    message: '',
    type: '', // 'success' or 'error'
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // In a real application, you would use actual environment variables.
    // Replace these placeholders with your EmailJS Service ID, Template ID, and Public Key.
    const serviceId = 'YOUR_EMAILJS_SERVICE_ID'; // e.g., 'service_abc123'
    const templateId = 'YOUR_EMAILJS_TEMPLATE_ID'; // e.g., 'template_xyz456'
    const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // e.g., 'user_123abc'

    if (serviceId === 'YOUR_EMAILJS_SERVICE_ID' || templateId === 'YOUR_EMAILJS_TEMPLATE_ID' || publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
      setModal({
        isVisible: true,
        message: 'Please replace placeholder EmailJS keys with your actual keys.',
        type: 'error',
      });
      return;
    }

    // EmailJS is loaded via CDN in the HTML wrapper
    window.emailjs.send(
      serviceId,
      templateId,
      formData,
      publicKey
    )
    .then(
      () => {
        setModal({
          isVisible: true,
          message: 'Message sent successfully!',
          type: 'success',
        });
        // Reset form fields
        setFormData({
          organization: '',
          name: '',
          designation: '',
          product: '',
          variant: '',
          email: '',
          mobile: '',
          country: '',
          quantity: '',
          time: '',
        });
      },
      err => {
        console.error('EmailJS send error:', err);
        setModal({
          isVisible: true,
          message: 'Failed to send message. Please try again later.',
          type: 'error',
        });
      }
    );
  };

  return (
    // The main container with the dark navy blue background and Inter font
    <div className="min-h-screen bg-[#222E50] font-['Inter']">
      {/* Tailwind CSS JIT will handle the keyframes and animation directly from these classes */}
      {/* This style block is for the blob animation, which is usually in tailwind.config.js.
          For a standalone file, we include it directly. */}
      <style>
        {`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
        `}
      </style>

      {/* Hero Section */}
      <div className="relative w-full bg-[#222E50] text-white text-center py-16 px-4 overflow-hidden">
        {/* Animated Background Shapes */}
        <AnimatedShape className="bg-[#D92429] w-72 h-72 top-[-10%] left-[10%]" delay={0} />
        <AnimatedShape className="bg-red-400 w-60 h-60 bottom-[-5%] right-[5%]" delay={2000} />
        <AnimatedShape className="bg-red-300 w-48 h-48 top-[20%] right-[20%]" delay={4000} />
        
        {/* Hero Content (z-index to be on top of shapes) */}
        <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              Connect with Rebecca Exim
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Explore our premium export products and connect with us.
            </p>
            <img src={LogoPlaceholder} alt="Rebecca Exim Logo" className="mx-auto w-24 h-24 max-w-full object-contain" />
        </div>
      </div>

      {/* Contact Form */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-4xl bg-gray-100 rounded-xl shadow-2xl -mt-12 mb-20">
          <div className="p-8">
            <p className="text-center text-gray-700 font-medium text-lg px-6 mb-8">
              Thanks for your interest! Kindly share your details below. Our team will reach out to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Organization', name: 'organization', type: 'text' },
                  { label: 'Name', name: 'name', type: 'text' },
                  { label: 'Designation', name: 'designation', type: 'text' },
                  { label: 'Product Interested', name: 'product', type: 'select' },
                  { label: 'Variant', name: 'variant', type: 'text' },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Mobile no', name: 'mobile', type: 'tel', pattern: '[0-9]{10}', title: '10-digit mobile' },
                  { label: 'Country', name: 'country', type: 'text' },
                  { label: 'Quantity', name: 'quantity', type: 'text' },
                  { label: 'Time of Purchase', name: 'time', type: 'text' },
                ].map(({ label, name, type, pattern, title }) => (
                  <div key={name} className="flex flex-col">
                    <label htmlFor={name} className="font-medium text-gray-800 mb-1">
                      {label} <span className="text-[#D92429]">*</span>
                    </label>
                    {type === 'select' ? (
                      <select
                        id={name} name={name} value={formData[name]} onChange={handleChange} required
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D92429]"
                      >
                        <option value="">-- Select a Product --</option>
                        {products.map(p => (<option key={p} value={p}>{p}</option>))}
                      </select>
                    ) : (
                      <input
                        id={name} name={name} type={type} value={formData[name]} onChange={handleChange} required
                        pattern={pattern} title={title}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D92429]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#D92429] text-white py-3 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300"
              >
                Submit Inquiry
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for messages */}
      <AnimatePresence>
        {modal.isVisible && (
          <MessageModal
            message={modal.message}
            type={modal.type}
            onClose={() => setModal({ ...modal, isVisible: false })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
