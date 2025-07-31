import React from "react";

const ProductDetailPage = ({
  title,
  mainImage,
  description,
  benefits,
  specifications,
  packaging,
}) => {
  return (
    <div className="bg-white text-gray-800">
      {/* Banner */}
      <div
        className="relative h-[240px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${mainImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <h1 className="z-10 text-3xl font-bold uppercase">{title}</h1>
      </div>

      {/* Product Details */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-4">Product Details</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Benefits */}
      {benefits && (
        <div className="bg-gray-100 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-bold text-center mb-8">
              Benefits of {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="bg-white p-6 rounded shadow text-center">
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-sm mt-2 text-gray-600">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specification */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-4">Product Specification</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(specifications).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Packaging Standards */}
      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-4">Packing Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packaging.map((item, i) => (
              <div key={i}>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
