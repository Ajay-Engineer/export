import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      title: "Quality First, Always",
      description: "We don't just meet global standards — we aim to exceed them. Every product goes through strict quality checks to ensure it's export-ready and reliable.",
      accentColor: "#B12929"
    },
    {
      title: "Trusted Rural Sourcing",
      description: "We work directly with skilled rural producers and certified processors to bring you authentic, traceable products with unmatched purity.",
      accentColor: "#414143"
    },
    {
      title: "Customization & Care",
      description: "From packaging to product variants, we offer flexible solutions tailored to your market needs — with careful attention to detail in every shipment.",
      accentColor: "#414143"
    },
    {
      title: "Integrity in Every Deal",
      description: "We believe in transparent communication, ethical sourcing, and long-term business relationships built on trust and consistency.",
      accentColor: "#B12929"
    }
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-10">
      <h2
        className="text-2xl sm:text-3xl font-extrabold text-black text-center mb-10"
        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
      >
        Why Choose Us
      </h2>

      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative bg-[#F1E6E6] rounded-md overflow-hidden p-6 sm:p-7"
          >
            {/* Accent Bar */}
            <div
              className="absolute left-0 top-0 w-2 h-full rounded-l-md"
              style={{ backgroundColor: feature.accentColor }}
            />
            <div className="pl-4 sm:pl-5">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base font-medium text-black leading-snug">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
