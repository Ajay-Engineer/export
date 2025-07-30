import HeroCarousel from './HeroCarousel';
import ProductsSection from './ProductsSection';
import AboutSection from './AboutSection';
import StatsSection from './StatsSection';
import RegionalSection from './RegionalSection';
import CompanyShowcase from './CompanyShowcase';
import WhyChooseUs from './WhyChooseUs';
import PackagingSection from './PackagingSection';
import CertificatesSection from './CertificatesSection';
import TestimonialsSection from './TestimonialsSection';

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section with Carousel */}
      <HeroCarousel />
      
      {/* Primary Products Section */}
      <ProductsSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Statistics Section */}
      <StatsSection />
      
      {/* Regional Segregation Section */}
      <RegionalSection />
      
      {/* Company Showcase Images */}
      <CompanyShowcase />
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Packaging Section */}
      <PackagingSection />
      
      {/* Certificates Section */}
      <CertificatesSection />
      
      {/* Client Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};

export default LandingPage;
