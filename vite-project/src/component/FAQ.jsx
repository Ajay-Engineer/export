import React, { useState } from 'react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: "What products does Rebecca Exim export?",
      answer: "We export a wide range of organic and natural products including herbal extracts, palm jaggery products, coir products, tea varieties, health mix, handicrafts, and egg products. All our products are sourced directly from manufacturers and farmers to ensure quality and authenticity."
    },
    {
      question: "What are your minimum order quantities (MOQ)?",
      answer: "Our MOQ varies by product category. For most products, we require a minimum order of 1000 units or 1 ton, depending on the product type. We also offer flexible packaging options from bulk to retail-ready formats. Contact us for specific MOQ details for your desired products."
    },
    {
      question: "Do you provide samples before bulk orders?",
      answer: "Yes, we provide samples for evaluation before bulk orders. Sample costs and shipping are typically borne by the buyer, but these costs are often credited against the final order. Sample lead time is usually 3-5 business days."
    },
    {
      question: "What certifications do your products have?",
      answer: "Our products are certified with ISO, HACCP, APEDA, and FSSAI standards. We also provide organic certifications where applicable. All products undergo rigorous quality testing and documentation to meet international standards."
    },
    {
      question: "What are your payment terms?",
      answer: "We offer flexible payment terms including advance payment, letter of credit (LC), and documentary collection. Payment terms are typically 30-60 days depending on order value and customer relationship. We accept major currencies including USD, EUR, and INR."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping time depends on destination and shipping method. Air freight typically takes 3-7 days, while sea freight takes 15-30 days. We provide door-to-door delivery services and handle all customs documentation. Express shipping options are available for urgent orders."
    },
    {
      question: "Do you provide packaging and labeling services?",
      answer: "Yes, we offer comprehensive packaging solutions including custom labeling, private labeling, and retail-ready packaging. Our packaging is designed to maintain product integrity and meet international shipping standards. We can accommodate specific branding requirements."
    },
    {
      question: "What countries do you export to?",
      answer: "We currently export to Europe, the Middle East, and Southeast Asia. Our major markets include Germany, UK, UAE, Singapore, and Malaysia. We're expanding our reach and can accommodate new markets based on demand and regulatory compliance."
    },
    {
      question: "How do you ensure product quality?",
      answer: "We implement strict quality control measures including in-house testing, third-party laboratory verification, and regular supplier audits. Each batch is tested for purity, potency, and safety. We maintain detailed quality documentation for all shipments."
    },
    {
      question: "What is your return and refund policy?",
      answer: "We accept returns within 30 days of delivery for quality issues. Products must be in original condition and packaging. We provide full refunds or replacements for defective products. Return shipping costs are covered by us for quality-related issues."
    },
    {
      question: "Do you offer private labeling services?",
      answer: "Yes, we provide private labeling services where we can customize packaging, labels, and branding according to your specifications. We work with you to create unique packaging designs that meet your brand requirements and target market needs."
    },
    {
      question: "How can I become a distributor or partner?",
      answer: "We welcome new distribution partnerships. Please contact us with your business profile, target markets, and product interests. We evaluate potential partners based on market reach, financial stability, and commitment to quality standards."
    },
    {
      question: "What makes Rebecca Exim different from other exporters?",
      answer: "Our competitive advantages include direct sourcing from manufacturers, in-house quality control, flexible packaging options, and personalized customer service. As a FIEO member, we maintain high ethical standards and offer reliable, long-term partnerships."
    },
    {
      question: "Do you provide technical support and documentation?",
      answer: "Yes, we provide comprehensive technical support including product specifications, safety data sheets, and usage guidelines. We also offer assistance with regulatory compliance and import documentation for different markets."
    },
    {
      question: "How can I contact Rebecca Exim for inquiries?",
      answer: "You can reach us through multiple channels: Email at admin@rebeccaexim.co.in, phone at +91 8807568848, or through our contact form on the website. We typically respond to inquiries within 24 hours during business days."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <span className="text-gray-500 text-xl">
                    {openItems.has(index) ? '−' : '+'}
                  </span>
                </button>
                {openItems.has(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Still Have Questions?
            </h2>
            <p className="text-gray-700 text-center mb-6">
              If you couldn't find the answer you're looking for, please don't hesitate to contact us directly.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Email Us</h3>
                <a 
                  href="mailto:admin@rebeccaexim.co.in"
                  className="text-blue-600 hover:underline"
                >
                  admin@rebeccaexim.co.in
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
                <a 
                  href="tel:+918807568848"
                  className="text-blue-600 hover:underline"
                >
                  +91 8807568848
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Visit Us</h3>
                <p className="text-gray-700 text-sm">
                  38, Jailsing nagar,<br />
                  Tirunelveli, Tamilnadu, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}