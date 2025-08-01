"use client";

import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Leaf,
  CakeSlice,
  Flower2,
  Coffee,
  HeartPulse,
  Hand,
  Egg,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/rebeccaexim_logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const productCategories = [
    {
      name: "Herbal Extract Products",
      path: "/products/herbal",
      icon: <Leaf className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Palm Jaggery Products",
      path: "/products/palm-jaggery",
      icon: <CakeSlice className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Coir Products",
      path: "/products/coir",
      icon: <Flower2 className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Tea Varieties",
      path: "/products/tea",
      icon: <Coffee className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Health Mix",
      path: "/products/health-mix",
      icon: <HeartPulse className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Handicrafts",
      path: "/products/handicraft",
      icon: <Hand className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Egg Products",
      path: "/products/egg",
      icon: <Egg className="w-4 h-4 text-red-600" />,
    },
  ];

  return (
    <header className="bg-gray-200 shadow-md w-full z-50 relative">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-end space-x-2">
          <img src={Logo} className="w-16 h-auto rounded-t-xl" alt="Logo" />
          <span className="text-xl font-bold text-black whitespace-nowrap">
            REBECCA EXIM
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) =>
            item.label === "Products" ? (
              <div
                key="Products"
                className="relative group"
                onClick={() => setIsProductOpen(!isProductOpen)}
              >
                <div className="flex items-center gap-1 text-xl font-bold text-black mt-3 hover:text-red-600 cursor-pointer">
                  {item.label}
                  <ChevronDown className="w-4 h-4 mt-1" />
                </div>

                {isProductOpen && (
                  <div className="absolute left-0 mt-3 bg-white border border-gray-300 rounded-lg shadow-xl w-80 z-50 p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Package className="w-5 h-5 text-red-600" />
                      <span className="text-lg font-semibold text-gray-800">
                        Our Products
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                      {productCategories.map((product) => (
                        <li key={product.name}>
                          <Link
                            to={product.path}
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-100 hover:text-red-700 transition"
                          >
                            {product.icon}
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="text-xl font-bold text-black mt-3 hover:text-red-600"
              >
                {item.label}
              </Link>
            )
          )}
          <button
            onClick={() => {}}
            className="bg-red-600 text-white px-4 py-1.5 text-lg rounded hover:bg-red-700 transition"
          >
            Get Quote
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 px-4 pb-4 space-y-2">
          {navItems.map((item) =>
            item.label === "Products" ? (
              <div key="mobile-products" className="space-y-1">
                <div className="text-sm font-semibold text-black">Products</div>
                <ul className="pl-2 space-y-1">
                  {productCategories.map((product) => (
                    <li key={product.name}>
                      <Link
                        to={product.path}
                        className="block text-sm text-black hover:text-red-600"
                        onClick={() => setIsOpen(false)}
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="block text-sm text-black hover:text-red-600"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          <button
            className="mt-2 bg-red-600 text-white px-4 py-2 w-full rounded hover:bg-red-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Get Quote
          </button>
        </div>
      )}
    </header>
  );
}
