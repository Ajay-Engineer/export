import React from 'react';

const AboutSection = () => {
  return (
    <section className="w-full bg-[#f4f4f4] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#1f2937] underline mb-12">
          About Us
        </h2>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Exporting India's Finest, Globally.
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Rebecca Exim is a trusted export company founded in 2025 with a mission to bring India’s rich heritage and craftsmanship to international markets. We specialize in <span className="font-medium text-gray-900">premium spices, coir products, and handcrafted textiles</span>, sourced with care and delivered with commitment.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              With a strong foundation in quality and compliance, we operate with integrity, ensuring transparency, timely shipments, and customer satisfaction at every stage.
            </p>
          </div>

          {/* Key Values Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Why Choose Us?</h4>
            <ul className="space-y-3 text-gray-700 text-base">
              <li><strong>Global Reach:</strong> Trusted network across continents.</li>
              <li><strong>Quality Assurance:</strong> Every batch meets international standards.</li>
              <li><strong>Timely Logistics:</strong> Strong ties with reliable shipping partners.</li>
              <li><strong>Ethical Practices:</strong> Sustainability and fairness in sourcing.</li>
              <li><strong> Customer-Centric:</strong> Solutions tailored to every client's need.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
