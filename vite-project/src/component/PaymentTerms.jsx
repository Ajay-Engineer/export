import {
  FaMoneyBillWave,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaPaperPlane,
  FaShieldAlt,
  FaUniversity,
  FaWarehouse,
  FaExchangeAlt,
  FaShip,
  FaFileInvoice,
  FaCube,
} from "react-icons/fa";

import payment from "../assets/payment.png"; // background image

const paymentOptions = [
  {
    label: "100% Advance Payment",
    icon: <FaMoneyBillWave />,
    desc: "Full payment made before shipment is processed.",
  },
  {
    label: "70% Advance Payment, 30% LC Irrevocable",
    icon: <FaCreditCard />,
    desc: "Initial advance with remaining secured through LC.",
  },
  {
    label: "LC – Irrevocable",
    icon: <FaFileInvoiceDollar />,
    desc: "Buyer provides an irrevocable Letter of Credit.",
  },
  {
    label: "TT – Telegraphic Transfer",
    icon: <FaPaperPlane />,
    desc: "Bank-to-bank electronic wire transfer.",
  },
  {
    label: "SBLC – Standby Letter of Credit",
    icon: <FaShieldAlt />,
    desc: "A payment guarantee issued by buyer’s bank.",
  },
  {
    label: "Standard LC",
    icon: <FaUniversity />,
    desc: "Traditional LC provided by international banks.",
  },
  {
    label: "Onsite LC",
    icon: <FaWarehouse />,
    desc: "Payment upon onsite document verification.",
  },
  {
    label: "Transferable LC",
    icon: <FaExchangeAlt />,
    desc: "Allows primary beneficiary to transfer credit.",
  },
];

const incoterms = [
  {
    label: "FOB (Freight On Board)",
    icon: <FaShip className="text-[#b12929] text-3xl mb-3" />,
  },
  {
    label: "CIF (Cost Insurance Freight)",
    icon: <FaFileInvoice className="text-[#b12929] text-3xl mb-3" />,
  },
  {
    label: "MOQ : 1 MT (Negotiable)",
    icon: <FaCube className="text-[#b12929] text-3xl mb-3" />,
  },
];

export default function PaymentTerms() {
  return (
    <div className="font-sans">
      {/* Header Section with Centered Text */}
      <div
        className="relative bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px] flex items-center justify-center"
        style={{ backgroundImage: `url(${payment})` }}
      >
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <h1 className="relative text-white text-3xl md:text-5xl font-bold z-10 text-center">
          PAYMENT TERMS
        </h1>
      </div>

      {/* Content Section */}
      <div className="py-12 px-4 md:px-20 text-center bg-white">
        <h4 className="text-sm text-gray-400 uppercase mb-2">Trade Confidence</h4>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-10">
          Flexible & Reliable Payment Options
        </h2>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {paymentOptions.map((option, index) => (
            <div
              key={index}
              className="bg-[#f0f4f8] text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300"
            >
              <div className="bg-white text-[#b12929] w-14 h-14 flex items-center justify-center rounded-full mb-4 text-2xl mx-auto shadow">
                {option.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{option.label}</h3>
              <p className="text-sm text-gray-600">{option.desc}</p>
            </div>
          ))}
        </div>

        {/* Incoterms Grid */}
        <h2 className="text-5xl font-bold text-green-700 mb-10">Incoterms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-20">
          {incoterms.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow"
            >
              {item.icon}
              <p className="text-black font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
