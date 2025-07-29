import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaLeaf,
  FaCube,
  FaPagelines,
  FaMugHot,
  FaHeartbeat,
  FaPaintBrush,
  FaEgg,
} from "react-icons/fa";
import Logo from "../assets/RebeccaExim_Logo1.jpg";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#b12626] text-white">
      {/* Main Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-12">
        {/* Logo + Description */}
        <div className="space-y-4 mt-5">
          <div className="flex items-end space-x-3">
            <img
              src={Logo}
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
            <li className="hover:text-blue-400 transition">・Home</li>
            <li className="hover:text-blue-400 transition">・Brand</li>
            <li className="hover:text-blue-400 transition">・Payment Terms</li>
            <li className="hover:text-blue-400 transition">・Contact Us</li>
            <li className="hover:text-blue-400 transition">・Privacy Policy</li>
            <li className="hover:text-blue-400 transition">
              ・Terms &amp; Conditions
            </li>
          </ul>
        </div>
        {/* Our Products with Icons */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">Our Products</h3>
          <ul className="space-y-3 text-white/90">
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <FaCube className="text-white w-5 h-5" />
              <span>Coir Products</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <FaMugHot className="text-white w-5 h-5" />
              <span>Tea Varieties</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <FaHeartbeat className="text-white w-5 h-5" />
              <span>Health Mix</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <FaPaintBrush className="text-white w-5 h-5" />
              <span>Handicrafts</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <FaEgg className="text-white w-5 h-5" />
              <span>Egg Products</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <FaLeaf className="text-white w-5 h-5" />
              <span>Herbal Extract Products</span>
            </li>
            <li className="flex items-center space-x-3 hover:text-blue-400">
              <FaPagelines className="text-white w-5 h-5" />
              <span>Palm Jaggery Products</span>
            </li>
          </ul>
        </div>
        {/* Contact Details */}
       
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">Contact Details</h3>
          <ul className="space-y-3 text-lg text-white/90">
            <li className="flex items-start space-x-3  hover:text-blue-400 transition">
              <MapPin className="w-5 h-5 font-bold mt-1 text-white flex-shrink-0" />
              <span>
                38, Jailsing nagar, Tirunelveli,
                <br />
                Tamilnadu, India
              </span>
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
          </ul>

          {/* Social Media Icons */}
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-white hover:text-blue-400 transition">
              <FaFacebookF className="w-8 h-8" />
            </a>
            <a href="#" className="text-white hover:text-pink-500 transition">
              <FaInstagram className="w-8 h-8" />
            </a>
            <a href="#" className="text-white hover:text-blue-300 transition">
              <FaTwitter className="w-8 h-8" />
            </a>
            <a href="#" className="text-white hover:text-blue-600 transition">
              <FaLinkedinIn className="w-8 h-8" />
            </a>
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
          </span>
        </div>
      </div>
    </footer>
  );
}
