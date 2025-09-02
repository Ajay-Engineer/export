import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Terms and Conditions
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to Rebecca Exim. These terms and conditions outline the rules and regulations for the use of our export services and the purchase of our products. By accessing this website and engaging in business with us, you accept these terms and conditions in full.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Export Compliance</h2>
            <p className="leading-relaxed mb-4">
              All our export activities comply with international trade regulations, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Customs regulations and documentation requirements</li>
              <li>International shipping standards and protocols</li>
              <li>Quality assurance and certification standards</li>
              <li>Environmental and sustainability regulations</li>
              <li>Country-specific import requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Product Quality and Standards</h2>
            <p className="leading-relaxed">
              Rebecca Exim is committed to delivering premium quality organic products. All our products meet international quality standards and undergo rigorous testing before export. We provide appropriate certifications and documentation to ensure compliance with destination country requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Shipping and Delivery</h2>
            <p className="leading-relaxed mb-4">
              We offer reliable shipping services with the following commitments:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Timely delivery within agreed timeframes</li>
              <li>Proper packaging to ensure product integrity</li>
              <li>Tracking information for all shipments</li>
              <li>Insurance coverage for high-value shipments</li>
              <li>Compliance with international shipping regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Payment Terms</h2>
            <p className="leading-relaxed">
              Payment terms are established on a case-by-case basis and may include Letter of Credit (LC), advance payments, or other mutually agreed methods. All payments must be made in accordance with the agreed terms to ensure smooth transaction processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Customs and Documentation</h2>
            <p className="leading-relaxed">
              We handle all necessary export documentation including commercial invoices, certificates of origin, phytosanitary certificates, and other required documentation. Buyers are responsible for import duties, taxes, and compliance with their country's import regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Risk and Liability</h2>
            <p className="leading-relaxed">
              While we take every precaution to ensure safe delivery, Rebecca Exim's liability is limited to the value of the goods as stated in the commercial invoice. We recommend buyers obtain appropriate insurance for their shipments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Force Majeure</h2>
            <p className="leading-relaxed">
              Rebecca Exim shall not be liable for delays or failures in performance due to circumstances beyond our reasonable control, including but not limited to natural disasters, political unrest, or global health emergencies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Dispute Resolution</h2>
            <p className="leading-relaxed">
              Any disputes arising from our business relationships shall be resolved through mutual discussion and negotiation. If necessary, disputes may be subject to arbitration in accordance with international commercial arbitration rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Information</h2>
            <p className="leading-relaxed">
              For any questions regarding these terms and conditions, please contact our business development team at admin@rebeccaexim.co.in or call +91 8807568848.
            </p>
          </section>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Last updated:</strong> September 2024<br />
              These terms and conditions are subject to periodic review and may be updated to reflect changes in regulations or business practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}