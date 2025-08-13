import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaLeaf,
  FaCube,
  FaPagelines,
  FaMugHot,
  FaHeartbeat,
  FaPaintBrush,
  FaEgg,
  FaMapMarkerAlt,
  FaXRay,
} from "react-icons/fa";
import Logo from "../assets/RebeccaExim_Logo1.jpg";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import Footerlogo from "../assets/Rebbcaeximfooter.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#b12626] text-white">
      {/* Main Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-12">
        {/* Logo + Description */}
        <div className="space-y-4 mt-5">
          <div className="flex justify-center space-x-3">
            <img
              src={Footerlogo}
              alt="Logo"
              className="w-52 h-auto shadow-sm object-contain"
            />
          </div>
          <p className="text-base sm:text-lg font-semibold leading-relaxed tracking-wide text-white/90">
            Rebecca Exim delivers premium organic products globally with quality
            assurance, eco-friendly practices and a commitment to sustainable
            agriculture.
          </p>
        </div>
        {/* Quick Links */}
        <div className="space-y-4 md:ml-10">
          <h3 className="text-xl sm:text-2xl font-bold">Quick Links</h3>
          <ul className="space-y-2 text-lg font-semibold text-white/90">
            <li>
              <Link to="/" className="hover:text-blue-400 transition cursor-pointer">・Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-blue-400 transition cursor-pointer">・Products</Link>
            </li>
            <li>
              <Link to="/brand" className="hover:text-blue-400 transition cursor-pointer">・Brand</Link>
            </li>
            <li className="hover:text-blue-400 transition">・Payment Terms</li>
            <li className="hover:text-blue-400 transition">・Contact Us</li>
            <li className="hover:text-blue-400 transition">・About Us</li>
            <li className="hover:text-blue-400 transition">・Privacy Policy</li>
            <li className="hover:text-blue-400 transition">
              ・Terms &amp; Conditions
            </li>
            <li>
              <Link
                to="/faq"
                className="hover:text-blue-400 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-red-800 rounded px-1"
                aria-label="Navigate to FAQ page"
              >
                ・FAQ
              </Link>
            </li>
          </ul>
        </div>
        {/* Our Products with Icons */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">Our Products</h3>
          <ul className="space-y-3 text-white/90">
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <a href="/products/coir" className="flex items-center space-x-3">
                <FaCube className="text-white w-5 h-5" />
                <span>Coir Products</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <a href="/products/tea" className="flex items-center space-x-3">
                <FaMugHot className="text-white w-5 h-5" />
                <span>Tea Varieties</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <a href="/products/health-mix" className="flex items-center space-x-3">
                <FaHeartbeat className="text-white w-5 h-5" />
                <span>Health Mix</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <a href="/products/handicraft" className="flex items-center space-x-3">
                <FaPaintBrush className="text-white w-5 h-5" />
                <span>Handicrafts</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <a href="/products/egg" className="flex items-center space-x-3">
                <FaEgg className="text-white w-5 h-5" />
                <span>Egg Products</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <a href="/products/herbal" className="flex items-center space-x-3">
                <FaLeaf className="text-white w-5 h-5" />
                <span>Herbal Extract Products</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <a href="/products/palm-jaggery" className="flex items-center space-x-3">
                <FaPagelines className="text-white w-5 h-5" />
                <span>Palm Jaggery Products</span>
              </a>
            </li>
          </ul>
        </div>
        {/* Contact Details */}

        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">Contact Details</h3>
          <ul className="space-y-3 text-lg text-white/90">
            <li className="flex items-center space-x-3 hover:text-blue-400 transition">
              <span className="text-lg font-semibold text-white/90">JEBAZ RAJA</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400 transition">
              <Phone className="w-5 h-5 text-white flex-shrink-0" />
              <a href="tel:+918807568848" className="hover:underline">
                +91 8807568848
              </a>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400 transition">
              <Mail className="w-5 h-5 text-white flex-shrink-0" />
              <a
                href="mailto:admin@rebeccaexim.co.in"
                className="hover:underline"
              >
                admin@rebeccaexim.co.in
              </a>
            </li>


            <li className="flex items-start space-x-3 hover:text-blue-400 transition">
              <FaMapMarkerAlt className="w-5 h-5 font-bold mt-1 text-white flex-shrink-0" />
              <a
                href="https://www.google.com/maps/place/38,+Jailsing+nagar,+Tirunelveli,+Tamilnadu,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-white/90"
              >
                38, Jailsing nagar, Tirunelveli,
                <br />
                Tamilnadu, India
              </a>
            </li>
          </ul>

          {/* Social Media Icons */}
          <div className="flex flex-col items-center pt-2">
            <span className="text-xs font-bold text-white uppercase tracking-widest mb-2">Follow Us</span>
            <div className="flex space-x-4">
              <a href="#" className="bg-gradient-to-tr from-pink-500 to-yellow-400 rounded-full p-2 text-white hover:from-pink-700 hover:to-yellow-500 transition">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="bg-blue-400 rounded-full p-2 text-white hover:bg-blue-600 transition">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="bg-blue-800 rounded-full p-2 text-white hover:bg-blue-900 transition">
                <FaLinkedinIn className="w-6 h-6" />
              </a>
              <a href="https://www.google.com/maps/place/38,+Jailsing+nagar,+Tirunelveli,+Tamilnadu,+India" target="_blank" rel="noopener noreferrer" className="bg-green-800 rounded-full p-2 text-white hover:bg-blue-800 transition">
                <FaMapMarkerAlt className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-white/30 mt-10 bg-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 text-sm md:text-base tracking-wide text-white/90 w-full">
          <span className="w-full md:w-1/3 text-left">
            © 2025 Rebecca Exim. All rights reserved.
          </span>
          <span className="w-full md:w-1/3 text-center text-2xl font-bold">
            #TrustedPartner
          </span>
          <span className="w-full md:w-1/3 text-right mt-2 md:mt-0">
            Developed by{" "}
            <a
              href="#"
              className="font-semibold text-white hover:text-blue-400 transition"
            >
              HIG Automation
            </a>
            <br />

          </span>
        </div>
      </div>
    </footer>
  );
}
