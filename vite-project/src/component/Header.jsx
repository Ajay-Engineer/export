"use client";

import { useState } from "react";
import React from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Egg,
  Hand,
  Sparkles,
  Home,
  Leaf,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/rebeccaexim_logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Payment", href: "/payment" },
    { label: "Brand", href: "/brand" },
    { label: "About Us", href: "/about" },
  ];

  const productCategories = [
    {
      name: "Health Mix",
      path: "/products/health-mix",
      icon: <HeartPulse className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Egg Products",
      path: "/products/egg",
      icon: <Egg className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Handicrafts",
      path: "/products/handicraft",
      icon: <Hand className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Decor Items",
      path: "/products/decor-items",
      icon: <Sparkles className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Home Textile",
      path: "/products/home-textile",
      icon: <Home className="w-4 h-4 text-red-600" />,
    },
    {
      name: "Bamboo Products",
      path: "/products/bamboo-products",
      icon: <Leaf className="w-4 h-4 text-red-600" />,
    },
  ];

  return (
    <header className="bg-gray-200 shadow-md w-full z-50 relative">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-end space-x-2 group">
          <img src={Logo} className="w-16 h-auto max-w-full rounded-t-xl group-hover:opacity-80 transition" alt="Logo" />
          <span className="text-xl font-serif text-black whitespace-nowrap">
            REBECCA EXIM
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-4 items-center ml-8">
          {navItems.map((item) =>
            item.label === "Products" ? (
              <div
                key="Products"
                className="relative group"
                onClick={() => setIsProductOpen(!isProductOpen)}
              >
                <div className="flex items-center gap-1 text-base font-semibold text-black hover:text-red-600 cursor-pointer">
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
                      <li>
                        <Link
                          to="/products"
                          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-100 hover:text-red-700 transition font-semibold border-b border-gray-200 mb-1"
                        >
                          <Package className="w-4 h-4 text-red-600" />
                          All Products
                        </Link>
                      </li>
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
                className="text-base font-semibold text-black hover:text-red-600 px-2 py-1"
              >
                {item.label}
              </Link>
            )
          )}
          <Link to="/contact" className="bg-red-600 text-white px-3 py-1 text-base rounded hover:bg-red-700 transition ml-2">
            Get Quote
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden ml-2 p-2 rounded-full border border-gray-400 bg-white shadow"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-7 h-7 text-red-600" /> : <Menu className="w-7 h-7 text-black" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 px-4 pb-4 space-y-2">
          {navItems.map((item) =>
            item.label === "Products" ? (
              <div key="mobile-products">
                <div
                  onClick={() => setIsMobileProductOpen(!isMobileProductOpen)}
                  className="flex items-center justify-between cursor-pointer py-2 text-base font-semibold text-black"
                >
                  <span>Products</span>
                  {isMobileProductOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
                {isMobileProductOpen && (
                  <ul className="pl-4 space-y-1 mt-1">
                    <li>
                      <Link
                        to="/products"
                        className="block text-base text-black hover:text-red-600 font-semibold border-b border-gray-200 mb-1"
                        onClick={() => {
                          setIsOpen(false);
                          setIsMobileProductOpen(false);
                        }}
                      >
                        All Products
                      </Link>
                    </li>
                    {productCategories.map((product) => (
                      <li key={product.name}>
                        <Link
                          to={product.path}
                          className="block text-base text-black hover:text-red-600"
                          onClick={() => {
                            setIsOpen(false);
                            setIsMobileProductOpen(false);
                          }}
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="block text-base text-black hover:text-red-600"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            className="mt-2 bg-red-600 text-white px-4 py-2 w-full rounded hover:bg-red-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Get Quote
          </Link>
        </div>
      )}
      {/* Owner Name Banner */}
    </header>
  );
}
