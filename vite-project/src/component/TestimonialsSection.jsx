import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Johnson, Global Buyer, Germany",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/04b27f635eb5f0e282a7bd05056407653f483dca?width=430",
      quote:
        "Their team is incredibly professional and responsive, helping us navigate complex international regulations with absolute ease.",
    },
    {
      name: "Rogits, Nutraceutical Brand, USA",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/4beb533e136f6c72d0789746576e107ff9a1e461?width=430",
      quote:
        "Reliable, efficient, and always willing to go the extra mile. They're our go-to for all our export needs.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const showPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      className="w-full py-16 px-4 text-white"
      style={{
        background:
          "url('https://api.builder.io/api/v1/image/assets/TEMP/b1a62d96b6d247000ac091ea08e7b1c79a2e785f?width=2880') center/cover no-repeat, #606163",
      }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold underline text-center mb-12 font-sans">
        What Global Clients Say
      </h2>

      {/* Desktop View - Show all */}
      <div className="hidden md:grid grid-cols-2 gap-10 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white text-black rounded-lg p-6 flex flex-col md:flex-row shadow-lg"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover mb-4 md:mb-0 md:mr-6"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {testimonial.name}
              </h3>
              <p className="text-base">{testimonial.quote}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - One testimonial with nav */}
      <div className="md:hidden max-w-md mx-auto">
        <div className="bg-white text-black rounded-lg p-6 flex flex-col items-center shadow-lg">
          <img
            src={testimonials[currentIndex].image}
            alt={testimonials[currentIndex].name}
            className="w-24 h-24 rounded-lg object-cover mb-4"
          />
          <h3 className="text-lg font-semibold mb-2 text-center">
            {testimonials[currentIndex].name}
          </h3>
          <p className="text-center text-base">
            {testimonials[currentIndex].quote}
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={showPrevious}
            className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-600"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            onClick={showNext}
            className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-600"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
