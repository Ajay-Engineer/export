import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, MessageCircle } from 'lucide-react';

const AdminBottomNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center">
          <Link
            to="/admin/dashboard"
            className={`flex flex-col items-center p-2 ${
              isActive('/admin/dashboard') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          <Link
            to="/admin/certificates"
            className={`flex flex-col items-center p-2 ${
              isActive('/admin/certificates') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs mt-1">Certificates</span>
          </Link>

          <Link
            to="/admin/testimonials"
            className={`flex flex-col items-center p-2 ${
              isActive('/admin/testimonials') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">Testimonials</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminBottomNav;
