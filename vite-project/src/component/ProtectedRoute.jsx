import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Simplified authentication check for deployment
  if (!user) {
    // Redirect to login page if trying to access management routes
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/management')) {
      return <Navigate to="/management/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
