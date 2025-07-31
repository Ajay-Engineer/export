
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



function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/Payment" element={<PaymentTerms />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:categoryPath" element={<DynamicCategory />} />

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
