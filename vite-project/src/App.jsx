
import { Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import React from "react";
import Footer from "./component/Footer";
import ContactForm from "./component/Form.jsx";
import PaymentTerms from "./component/PaymentTerms.jsx";
import TermsAndConditions from "./component/TermsAndConditions.jsx";
import LandingPage from "./component/LandingPage";
import ProductAdmin from "./pages/ProductAdmin";
import ProductsPage from "./component/ProductsPage";
import DynamicCategory from "./component/DynamicCategory";
import CategoryManagement from "./component/CategoryManagement";
import AdminLogin from "./component/AdminLogin";
import AdminDashboard from "./component/AdminDashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AboutSection from "./component/AboutSection";
import CertificatesSection from "./component/CertificatesSection";
import CompanyShowcase from "./component/CompanyShowcase";
import HeroCarousel from "./component/HeroCarousel";
import PackagingSection from "./component/PackagingSection";
import ProductsSection from "./component/ProductsSection";
import RegionalSection from "./component/RegionalSection";
import StatsSection from "./component/StatsSection";
import TestimonialsSection from "./component/TestimonialsSection";
import WhyChooseUs from "./component/WhyChooseUs";
import EggProducts from "./component/EggProducts";
import HealthMixProducts from "./component/HealthMixProducts";
import HandicraftProducts from "./component/HandicraftProducts";
import DecorItemsProducts from "./component/DecorItemsProducts";
import HomeTextileProducts from "./component/HomeTextileProducts";
import BambooProducts from "./component/BambooProducts";
import ProductCategory from "./component/ProductCategory";
import ProductSubcategory from "./component/ProductSubcategory";
import ProductDetailPage from "./component/ProductDetailPage";
import ProductCreateForm from "./component/ProductCreateForm";

import Brand from "./component/Brand";
import FAQ from "./component/FAQ";
import AdminCertificate from "./component/AdminCertificate";
import AdminTestimonials from "./component/AdminTestimonials.jsx";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/Payment" element={<PaymentTerms />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/brand" element={<Brand />} />
            {/* Product Routes */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/health-mix" element={<HealthMixProducts />} />
            <Route path="/products/egg" element={<EggProducts />} />
            <Route path="/products/handicraft" element={<HandicraftProducts />} />
            <Route path="/products/decor-items" element={<DecorItemsProducts />} />
            <Route path="/products/home-textile" element={<HomeTextileProducts />} />
            <Route path="/products/bamboo-products" element={<BambooProducts />} />
            <Route path="/products/category" element={<ProductCategory />} />
            <Route path="/products/subcategory" element={<ProductSubcategory />} />
            <Route 
              path="/admin/add" 
              element={
                <ProtectedRoute>
                  <ProductCreateForm />
                </ProtectedRoute>
              }
            />
            
            {/* Company Information Routes */}
            <Route path="/certificates" element={<CertificatesSection />} />
            <Route path="/company" element={<CompanyShowcase />} />
            <Route path="/packaging" element={<PackagingSection />} />
            <Route path="/regional" element={<RegionalSection />} />
            <Route path="/why-choose-us" element={<WhyChooseUs />} />
            <Route path="/testimonials" element={<TestimonialsSection />} />
            <Route path="/stats" element={<StatsSection />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <CategoryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute>
                  {/** Admin certificate management UI */}
                  <AdminCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute>
                  <AdminTestimonials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <ProductAdmin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {/* Only show footer on non-admin pages */}
        {!window.location.pathname.startsWith('/admin') && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
