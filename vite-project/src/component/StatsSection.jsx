import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      number: "6+",
      label: "Countries",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/605f2529b78632562ca0bc6113d6706eca43a20c?width=160",
    },
    {
      number: "20+",
      label: "Products",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/e255d4399d24d34f5efbea5696981ec4837ca1d5?width=190",
    },
    {
      number: "200+",
      label: "Clients",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/d9ac938592a35765bdaac7213b8cbd4e6e4cf7ce?width=198",
    },
    {
      number: "10+ Years",
      label: "Experience",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/d052f9e47dec1e3f1ee86037426ad4948b3c1205?width=234",
    },
  ];

  return (
    <section className="w-full bg-[#B12929] py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-[#DEE4F3] px-2 border-r border-[#DEE4F3] last:border-none"
            >
              <img
                src={stat.image}
                alt={stat.label}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-2"
              />
              <div className="text-xl sm:text-2xl font-bold">{stat.number}</div>
              <div className="text-sm sm:text-base font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
