import React, { useState } from 'react';
import logo from "../assets/RebeccaExim_Logo1.jpg"

const AboutSection = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full bg-[#f4f4f4] py-10 md:py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#1f2937] underline mb-12">
          About Us
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left - Core Info */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Delivering India’s Excellence to the World
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Rebecca Exim is an export-focused enterprise dedicated to bringing India’s finest natural and handcrafted products to international markets. Established in 2025, we specialize in <span className="font-semibold text-gray-900">high-grade spices, eco-friendly coir products, and heritage textiles</span> with a commitment to quality and sustainability.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              We serve a global clientele of importers, distributors, and enterprise buyers who value authenticity, ethical sourcing, and on-time delivery backed by compliance and trust.
            </p>

            {/* Learn More Toggle */}
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-6 px-6 py-2 bg-[#1f2937] text-white rounded hover:bg-gray-800 transition duration-200"
            >
              {showMore ? 'Show Less' : 'Learn More'}
            </button>

            {/* Learn More Content */}
            {showMore && (
              <div className="mt-6 space-y-6 text-gray-700">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Our Global Legacy</h4>
                  <p>
                    Over the years, we’ve built strong relationships with partners across North America, Europe, Asia, and the Middle East. Our legacy lies in our ability to consistently deliver value and integrity, regardless of scale or region.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Certifications & Compliance</h4>
                  <p>
                    We adhere to international standards including ISO, HACCP, APEDA, and FSSAI. Each product batch undergoes rigorous testing and documentation to meet the expectations of world-class buyers.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Packaging & Protection</h4>
                  <p>
                    Our packaging solutions are engineered to maintain product integrity from source to shelf. Options range from bulk to retail-ready formats, all optimized for freshness, safety, and presentation.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Our Promise</h4>
                  <p>
                    At Rebecca Exim, we believe in long-term relationships. Our promise is built on transparency, customer service, and consistent performance—every shipment, every time.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Competitive Advantage</h4>
                  <p>
                    Unlike volume-driven exporters, we focus on precision, compliance, and flexibility. With in-house quality control, streamlined logistics, and ethical sourcing, we meet the evolving needs of global enterprises.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right - Image */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
            <img
              src={logo} // Update to match your actual file
              alt="Rebecca Exim Global Exports"
              className="rounded-xl object-cover w-full max-h-[400px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
