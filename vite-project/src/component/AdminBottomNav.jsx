import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, MessageCircle, Package, Settings } from 'lucide-react';

const AdminBottomNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4">
        {/* Mobile Layout - 4 main tabs */}
        <div className="flex justify-around items-center py-2 sm:hidden">
          <Link
            to="/management"
            className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              isActive('/management') || isActive('/management/dashboard')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 active:scale-95'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium leading-tight">Dashboard</span>
          </Link>

          <Link
            to="/management/products"
            className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              isActive('/management/products')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 active:scale-95'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium leading-tight">Products</span>
          </Link>

          <Link
            to="/management/certificates"
            className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              isActive('/management/certificates')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 active:scale-95'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium leading-tight">Certificates</span>
          </Link>

          <Link
            to="/management/testimonials"
            className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              isActive('/management/testimonials')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 active:scale-95'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium leading-tight">Testimonials</span>
          </Link>
        </div>

        {/* Tablet and Desktop Layout - All 5 tabs */}
        <div className="hidden sm:flex justify-around items-center py-2">
          <Link
            to="/management"
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              isActive('/management') || isActive('/management/dashboard')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:scale-95'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Dashboard</span>
          </Link>

          <Link
            to="/management/products"
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              isActive('/management/products')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:scale-95'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Products</span>
          </Link>

          <Link
            to="/management/categories"
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              isActive('/management/categories')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:scale-95'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Categories</span>
          </Link>

          <Link
            to="/management/certificates"
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              isActive('/management/certificates')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:scale-95'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Certificates</span>
          </Link>

          <Link
            to="/management/testimonials"
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              isActive('/management/testimonials')
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:scale-95'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Testimonials</span>
          </Link>
        </div>

        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white"></div>
      </div>
    </div>
  );
};

export default AdminBottomNav;
