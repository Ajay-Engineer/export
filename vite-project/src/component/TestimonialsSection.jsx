import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Johnson,...",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/04b27f635eb5f0e282a7bd05056407653f483dca?width=430",
      quote:
        "Their team is incredibly professional and responsive, helping us navigate complex international regulations with absolute ease.",
      moreIcon:
        "https://api.builder.io/api/v1/image/assets/TEMP/a08abc9de0dbcbe0b6974b25b77df8da4b4768e5?width=180",
      quoteIcon:
        "https://api.builder.io/api/v1/image/assets/TEMP/cf567211b6cb1fe644ed9282aff5945d888b39ef?width=90",
    },
    {
      name: "Rogits,...",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/4beb533e136f6c72d0789746576e107ff9a1e461?width=430",
      quote:
        "Reliable, efficient, and always willing to go the extra mile. They're our go-to for all our export needs.",
      moreIcon:
        "https://api.builder.io/api/v1/image/assets/TEMP/c8a5cc22a40406cc8db7a67e8ed55870159d6cda?width=180",
      quoteIcon:
        "https://api.builder.io/api/v1/image/assets/TEMP/f7d337c78628c0844737828589fc7625a1002f35?width=90",
    },
  ];

  return (
    <section
      className="w-full py-16 px-4 text-white"
      style={{
        background:
          "url('https://api.builder.io/api/v1/image/assets/TEMP/b1a62d96b6d247000ac091ea08e7b1c79a2e785f?width=2880') center/cover no-repeat, #606163",
      }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold underline text-center mb-12 font-sans">
        Our Client's Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white text-black rounded-lg p-6 flex flex-col md:flex-row shadow-lg relative"
          >
            {/* Profile Image */}
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-36 h-36 md:w-48 md:h-48 rounded-lg object-cover mb-4 md:mb-0 md:mr-6"
            />

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                {testimonial.name}
              </h3>
              <p className="text-base leading-relaxed">{testimonial.quote}</p>
            </div>

            {/* Icons */}
            <img
              src={testimonial.quoteIcon}
              alt="Quote"
              className="absolute top-4 right-4 w-6 h-6"
            />
            <img
              src={testimonial.moreIcon}
              alt="More"
              className="absolute bottom-4 right-4 w-10"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons Placeholder (Non-functional) */}
      <div className="mt-10 flex justify-center gap-6">
        <button className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-600">
          <ChevronLeft className="text-white" />
        </button>
        <button className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-600">
          <ChevronRight className="text-white" />
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
