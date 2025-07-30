import {  Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Footer from './component/Footer';
import ContactForm from './component/Form.jsx';
import PaymentTerms from './component/PaymentTerms.jsx';
import LandingPage from './component/LandingPage';

function App() {
  return (
    <>
      <Header />
        

       <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} /> */}
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/Payment" element={<PaymentTerms />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
