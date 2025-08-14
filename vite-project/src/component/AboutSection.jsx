import React, { useState } from 'react';
import logo from "../assets/Rebbcaeximfooter.png"

const AboutSection = ({ showVisionMission = true }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full bg-[#f4f4f4] py-10 md:py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#1f2937] underline mb-4">
          About Us
        </h2>
        <p className="text-xl text-center text-[#b12626] font-semibold mb-10">
          Welcome to Rebecca Exim – Where quality meets global demand.
        </p>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left - Core Info */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
             Trusted Company
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
             Rebecca Exim has evolved into a globally focused export company committed to excellence, trust, and customer satisfaction. Founded by <span className="font-semibold text-gray-900">Mr. Jebaz Raja</span>, our journey began with a strong foundation in local trade and a deep understanding of sourcing quality products directly from manufacturers and farmers.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              Today, we proudly extend our reach across <span className="font-semibold text-gray-900">Europe, the Middle East, and Southeast Asia</span>, delivering value through ethical practices, strict quality control, and dependable service. As a recognized member of the <span className="font-semibold text-gray-900">Federation of Indian Export Organisations (FIEO)</span>, we operate with transparency and dedication in every transaction.
            </p>
            <div className="mt-6 mb-2">
              <h4 className="text-xl font-bold text-gray-800 mb-2">Our Values</h4>
              <ul className="space-y-2 text-lg">
                <li className="flex items-center gap-2"><span className="text-green-600 text-xl">✔️</span> <span>Quality Assurance</span></li>
                <li className="flex items-center gap-2"><span className="text-green-600 text-xl">✔️</span> <span>Direct Sourcing</span></li>
                <li className="flex items-center gap-2"><span className="text-green-600 text-xl">✔️</span> <span>Customer-Centric Service</span></li>
                <li className="flex items-center gap-2"><span className="text-green-600 text-xl">✔️</span> <span>On-Time Delivery</span></li>
              </ul>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              At Rebecca Exim, we believe in building long-term partnerships by consistently meeting international expectations. We are dedicated to ethical business, sustainable sourcing, and exceeding the standards of our global clients.
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
                    Over the years, we've built strong relationships with partners across North America, Europe, Asia, and the Middle East. Our legacy lies in our ability to consistently deliver value and integrity, regardless of scale or region.
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
          <div className="bg-white rounded-lg shadow-lg">
            <img
                src={logo}
                alt="Rebecca Exim Global Exports"
                className="rounded-xl w-full max-h-[400px] object-contain"
              />
            {/* Desktop: Vision/Mission/Trust cards below logo - shown when Learn More is clicked */}
            {showMore && showVisionMission && (
              <div className="hidden md:block mt-6 space-y-4 w-full transition-all duration-500 ease-in-out">
                <div className="bg-gray-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
                  <h4 className="text-lg font-bold text-[#b12626] mb-2">Our Vision</h4>
                  <p className="text-gray-700 text-sm">To be a global leader in delivering India's finest organic, natural, and handcrafted products, fostering sustainable growth and enriching lives worldwide.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
                  <h4 className="text-lg font-bold text-[#b12626] mb-2">Our Mission</h4>
                  <p className="text-gray-700 text-sm">To empower communities and customers by providing high-quality, ethically sourced products, ensuring transparency, reliability, and environmental stewardship in every export.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
                  <h4 className="text-lg font-bold text-[#b12626] mb-2">Our Trust & Values</h4>
                  <p className="text-gray-700 text-sm">We build trust through integrity, compliance, and a commitment to long-term relationships. Our values are rooted in honesty, respect, and a passion for excellence.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Vision/Mission/Trust cards below entire section - shown by default */}
        {showVisionMission && (
          <div className={`transition-all duration-500 ease-in-out ${showMore ? 'md:opacity-0 md:scale-95 md:pointer-events-none opacity-100 scale-100 mt-6' : 'opacity-100 scale-100 mt-4'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-xl font-bold text-[#b12626] mb-2 transform transition-all duration-300 hover:scale-105">Our Vision</h3>
              <p className="text-gray-700 text-base">To be a global leader in delivering India's finest organic, natural, and handcrafted products, fostering sustainable growth and enriching lives worldwide.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-xl font-bold text-[#b12626] mb-2 transform transition-all duration-300 hover:scale-105">Our Mission</h3>
              <p className="text-gray-700 text-base">To empower communities and customers by providing high-quality, ethically sourced products, ensuring transparency, reliability, and environmental stewardship in every export.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-xl font-bold text-[#b12626] mb-2 transform transition-all duration-300 hover:scale-105">Our Trust & Values</h3>
              <p className="text-gray-700 text-base">We build trust through integrity, compliance, and a commitment to long-term relationships. Our values are rooted in honesty, respect, and a passion for excellence.</p>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
