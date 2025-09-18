import React from 'react';

const PackagingSection = () => {
  const packagingTypes = [
    {
      title: "Standard Wise Packing",
      description: "Our standard packing process is designed to meet global compliance regulations, providing reliable protection for goods during long-distance transportation. With a focus on universal standards, this packing method ensures that your products are safe, secure, and ready for any logistics environment.",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/5da5529c48a3afc50462368bb58ea5e86493b686?width=640"
    },
    {
      title: "Size Wise Packing",
      description: "Each product is packed precisely according to its size—ensuring minimal wasted space and maximum efficiency. Whether it's a delicate small item or a large bulky package, our packing strategy adjusts to suit the dimensions, reducing shipping costs and improving handling safety.",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/75b0ea4366e308189ef6997dd6615028e54e63bd?width=640"
    },
    {
      title: "Regional Wise Packing",
      description: "We understand the specific challenges faced during regional transport. That’s why our regional-wise packing considers climate sensitivity, regulatory compliance, and optimal packaging materials suited for local infrastructure. This ensures safe arrival whether by land, air, or sea.",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/d88b2461594912b7fed0f4d03f76acf5dc74aaaf?width=640"
    }
  ];

  return (
    <section
      className="w-full py-6 px-4 pb-10"
      style={{
        background: `url('https://api.builder.io/api/v1/image/assets/TEMP/11ff832bc261c20f5a9163fb10ae63a0268aef7b?width=2880') center/cover no-repeat, #6A6B6D`
      }}
    >
      <h2
        className="text-3xl sm:text-4xl font-bold text-white underline text-center mb-8"
        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
      >
        Packaging Standards
      </h2>
      <div className="max-w-4xl mx-auto mb-10">
        <h3 className="text-2xl font-semibold text-white mb-4">Benefits</h3>
        <p className="text-lg text-white leading-relaxed">
          Our packaging standards are designed to meet global compliance regulations, providing reliable protection for goods during long-distance transportation with a focus on universal standards for safety and security. Each product is packed precisely according to its size, ensuring minimal wasted space and maximum efficiency while reducing shipping costs and improving handling safety. We also consider climate sensitivity, regulatory compliance, and optimal packaging materials for regional transport to ensure safe arrival by land, air, or sea.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {packagingTypes.map((type, index) => (
          <div
            key={index}
            className={`flex flex-col lg:flex-row items-center gap-6 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            <img
              src={type.image}
              alt={type.title}
              className="w-full sm:w-[260px] lg:w-[300px] h-[28vh] sm:h-[30vh] lg:h-[32vh] object-cover rounded-md shadow"
            />
            <div className="text-white text-lg sm:text-xl max-w-2xl px-2 leading-relaxed">
              <h3 className="text-xl sm:text-2xl font-bold underline mb-3">{type.title}</h3>
              <p className="font-semibold text-lg">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackagingSection;
