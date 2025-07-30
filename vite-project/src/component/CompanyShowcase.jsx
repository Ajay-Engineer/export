import React from "react";

const CompanyShowcase = () => {
  // Define base URL and target widths for Builder.io images
  const builderIoBaseUrl = "https://api.builder.io/api/v1/image/assets/TEMP/";

  // --- Optimized Widths for Image SourceSets ---
  const leftImageWidths = [480, 720, 960];
  const leftImageSrcId = "84ba914b41ba87b4b4af510987d2d9e4c2cf170e";

  const rightImageWidths = [360, 540, 720];
  const rightImageSrcIds = [
    "30a6f354585df9123c63d3ca090ee4c3023d74be",
    "7524f61bccb4dc61302fe4f5c94b1b08864c7af0",
  ];

  // Helper function to generate srcset string
  const generateSrcset = (id, widths) => {
    return widths.map(w => `${builderIoBaseUrl}${id}?width=${w} ${w}w`).join(', ');
  };

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* 1. Responsive Heading Text Size */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
        Company Showcase
      </h2>

      {/* 2. Responsive Grid Layout and Max Width */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Image Container */}
        <div className="w-full aspect-[3/2] md:aspect-video lg:aspect-[4/3] overflow-hidden rounded-lg shadow-md">
          <img
            src={`${builderIoBaseUrl}${leftImageSrcId}?width=${leftImageWidths[0]}`}
            // 3. Responsive Image Source Loading (srcset/sizes)
            srcSet={generateSrcset(leftImageSrcId, leftImageWidths)}
            sizes="(max-width: 1023px) 100vw, 50vw" // This is key for image responsiveness
            alt="Company overview"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Right stacked images Container */}
        <div className="w-full flex flex-col gap-6">
          {rightImageSrcIds.map((srcId, i) => (
            <div
              key={i}
              className="w-full aspect-video rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={`${builderIoBaseUrl}${srcId}?width=${rightImageWidths[0]}`}
                // 3. Responsive Image Source Loading (srcset/sizes)
                srcSet={generateSrcset(srcId, rightImageWidths)}
                sizes="(max-width: 1023px) 100vw, 50vw" // This is key for image responsiveness
                alt={`Company image ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center center" }}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyShowcase;