import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Mail, CheckCircle } from "lucide-react";
import axios from 'axios';


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

function CertificateImage({ certId, certTitle, fallbackImage }) {
  const [certData, setCertData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setIsLoading(true);
        if (certId) {
          const response = await axios.get(`http://localhost:3001/api/certificates/${certId}`);
          if (response.data) {
            setCertData(response.data);
          }
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [certId]);

  if (isLoading) {
    return (
      <div className="h-48 w-48 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  const imgSrc = certData && certData.image ? certData.image : fallbackImage;

  if (!imgSrc) {
    return null;
  }

  return (
    <div className="relative group bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-300">
      <img
        src={imgSrc}
        alt={`${certTitle} Certificate`}
        className="w-full h-64 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          console.error('Certificate image load error:', {
            certId,
            url: imgSrc
          });
          if (e.target instanceof HTMLImageElement) {
            e.target.src = 'https://res.cloudinary.com/dxixoivs7/image/upload/v1/placeholder-certificate.png';
          }
        }}
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
        <p className="text-white text-center font-medium p-4">
          {certTitle}
        </p>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  title,
  images = [],
  mainImage = null,
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
    // Debug log to check certifications data
    console.log('Certifications received:', certifications);
  }, [certifications]);

  // Convert backend-relative image paths to absolute URLs when needed
  const formatImageUrl = (img) => {
    if (!img) {
      console.debug('No image URL provided');
      return 'https://res.cloudinary.com/dxixoivs7/image/upload/v1/placeholder-certificate.png';
    }

    if (typeof img !== 'string') {
      console.debug('Non-string image value:', img);
      return img;
    }
    
    console.debug('Processing image URL:', img);
    
    // If it's already a full Cloudinary URL, return as is
    if (img.startsWith('http')) {
      console.debug('Using full URL:', img);
      return img;
    }
    
    // Check if it's a Cloudinary public_id
    if (img.startsWith('certificates/') || img.includes('/certificates/')) {
      const cloudinaryUrl = `https://res.cloudinary.com/dxixoivs7/image/upload/${img.replace(/^\/+/, '')}`;
      console.debug('Generated Cloudinary URL:', cloudinaryUrl);
      return cloudinaryUrl;
    }

    // For legacy/local URLs
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://rebecca-exim-api.herokuapp.com'
      : 'http://localhost:3001';

    // ensure leading slash
    return img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
  };

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
        {((mainImage || (images && images.length > 0)) ) && (
          <motion.img
            src={formatImageUrl(mainImage ?? images[0])}
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

      {/* Certifications Section */}
      <motion.section
        id="certs"
        className="w-full bg-white py-12 px-0"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Certifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {certifications.map((cert, i) => {
              const certTitle = cert.title || cert.name || "Certificate";
              const imageUrl = cert.image || formatImageUrl(cert.image);

              return (
                <CertificateImage
                  key={cert._id || i}
                  certId={cert._id}
                  certTitle={certTitle}
                  fallbackImage={imageUrl}
                />
              );
            })}
          </div>
        </div>
      </motion.section>

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
