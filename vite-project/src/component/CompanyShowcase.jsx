import React from "react";
import s1 from "../assets/Rebecca_Exim_showcase.jpg";
import s2 from "../assets/rebecca_Exim_showcase_left_01.jpg"
import s3 from "../assets/Rebecca_Exim_ShowCAse_02_left.png"

const CompanyShowcase = () => {
  // Define base URL and target widths for Builder.io images
  const builderIoBaseUrl = "https://api.builder.io/api/v1/image/assets/TEMP/";

  // --- Optimized Widths for Image SourceSets ---
  const leftImageWidths = [480, 720, 960];
  const leftImageSrcId = "84ba914b41ba87b4b4af510987d2d9e4c2cf170e";

  const rightImageWidths = [360, 540, 720];
  const rightImageSrcIds = [
    s2,
    s3,
  ];

  // Check if srcId is a local image or Builder.io ID
  const isLocalImage = (srcId) => typeof srcId === 'string' && srcId.startsWith('/');

  // Helper function to generate srcset string
  const generateSrcset = (id, widths) => {
    return widths.map(w => `${builderIoBaseUrl}${id}?width=${w} ${w}w`).join(', ');
  };

  return (
    <section className="w-full bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 1. Responsive Heading Text Size */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black underline mb-6 md:mb-10">
        Company Showcase
      </h2>

      {/* 2. Responsive Grid Layout and Max Width */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Image Container */}
        <div className="w-full aspect-[3/2] md:aspect-video lg:aspect-[4/3] overflow-hidden rounded-lg ">
          <img
            src={s1}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            alt="Company overview"
            className="w-full h-full object-cover md:object-cover lg:object-contain"
            style={{ objectPosition: "bottom" }}
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
                src={isLocalImage(srcId) ? srcId : `${builderIoBaseUrl}${srcId}?width=${rightImageWidths[0]}`}
                // 3. Responsive Image Source Loading (srcset/sizes)
                srcSet={isLocalImage(srcId) ? undefined : generateSrcset(srcId, rightImageWidths)}
                sizes={isLocalImage(srcId) ? "(max-width: 1023px) 100vw, 50vw" : "(max-width: 1023px) 100vw, 50vw"}
                alt={`Company image ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center bottom" }}
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