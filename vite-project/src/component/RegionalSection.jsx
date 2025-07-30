import React from 'react';

const RegionalSection = () => {
  const regions = [
    {
      title: "Asian Wise Products",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/522b57fa8779784615b2a87ae2d7bef77e784d1d?width=616"
    },
    {
      title: "Gulf Wise Products",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/ced567d3717432813ed0ff81f100ba45eb763fa5?width=602",
    },
    {
      title: "European Wise Products",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/aedbf811d37f67db0b8120d9dc6e852cfb12e79e?width=596"
    }
  ];

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-black underline mb-10">
        Regional Segregation
      </h2>

      {/* Region Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {regions.map((region, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="relative w-full max-w-[320px] aspect-[1/1] rounded-lg overflow-hidden shadow-md">
              <img
                src={region.image}
                alt={region.title}
                className="w-full h-full object-cover"
              />
              {region.overlay && (
                <img
                  src={region.overlay}
                  alt=""
                  className="absolute bottom-0 left-0 w-full h-[45%] object-cover"
                />
              )}
            </div>
            <h3 className="mt-4 text-xl sm:text-2xl font-bold text-black">
              {region.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RegionalSection;
