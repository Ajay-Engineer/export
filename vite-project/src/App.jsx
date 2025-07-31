
import { Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import ContactForm from "./component/Form.jsx";
import PaymentTerms from "./component/PaymentTerms.jsx";
import LandingPage from "./component/LandingPage";
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
import TeaProducts from "./component/TeaProducts";
import PalmJaggeryProducts from "./component/PalmJaggeryProducts";
import EggProducts from "./component/EggProducts";
import HealthMixProducts from "./component/HealthMixProducts";
import HerbalProducts from "./component/HerbalProducts";
import HandicraftProducts from "./component/HandicraftProducts";
import CoirProducts from "./component/CoirProducts";
import ProductCategory from "./component/ProductCategory";
import ProductSubcategory from "./component/ProductSubcategory";



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
            
            {/* Product Routes */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/tea" element={<TeaProducts />} />
            <Route path="/products/palm-jaggery" element={<PalmJaggeryProducts />} />
            <Route path="/products/egg" element={<EggProducts />} />
            <Route path="/products/health-mix" element={<HealthMixProducts />} />
            <Route path="/products/herbal" element={<HerbalProducts />} />
            <Route path="/products/handicraft" element={<HandicraftProducts />} />
            <Route path="/products/coir" element={<CoirProducts />} />
            <Route path="/products/category" element={<ProductCategory />} />
            <Route path="/products/subcategory" element={<ProductSubcategory />} />
            
            {/* Company Information Routes */}
            <Route path="/certificates" element={<CertificatesSection />} />
            <Route path="/company" element={<CompanyShowcase />} />
            <Route path="/packaging" element={<PackagingSection />} />
            <Route path="/regional" element={<RegionalSection />} />
            <Route path="/why-choose-us" element={<WhyChooseUs />} />
            <Route path="/testimonials" element={<TestimonialsSection />} />
            <Route path="/stats" element={<StatsSection />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
