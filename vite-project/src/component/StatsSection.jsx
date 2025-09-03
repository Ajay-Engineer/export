import React from "react";

const StatsSection = () => {
  const stats = [
    {
      number: "6+",
      label: "Countries Served",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/605f2529b78632562ca0bc6113d6706eca43a20c?width=160",
    },
    {
      number: "20+",
      label: "Export Products",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/e255d4399d24d34f5efbea5696981ec4837ca1d5?width=190",
    },
    {
      number: "200+",
      label: "Shipments Delivered",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/d9ac938592a35765bdaac7213b8cbd4e6e4cf7ce?width=198",
    },
    {
      number: "20+",
      label: "Trusted Partners",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/e255d4399d24d34f5efbea5696981ec4837ca1d5?width=190",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-r from-[#AA1E1E] to-[#B12929] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 text-center relative">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-[#F0F4FF] px-3 relative group"
            >
              {/* Vertical Line */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 h-16 border-r border-white opacity-30"></div>
              )}

              {/* Image */}
              <img
                src={stat.image}
                alt={stat.label}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-4 transition-transform duration-200 group-hover:scale-105"
              />

              {/* Number */}
              <div className="text-2xl md:text-3xl font-extrabold tracking-wide">
                {stat.number}
              </div>

              {/* Label */}
              <div className="text-sm md:text-base font-medium opacity-90 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
