import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LoadingProvider } from './contexts/LoadingContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductCategories from './components/ProductCategories';
import NewArrivals from './components/NewArrivals';
import MapLocation from './components/MapLocation';
import TrustedBrands from './components/TrustedBrands';
import CollapsibleContent from './components/CollapsibleContent';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import FloatingActions from './components/FloatingActions';

// Import category pages - renamed for food products
import Sauces from './pages/Sauces';
import Ketchup from './pages/Ketchup';
import Mayonnaise from './pages/Mayonnaise';
import Dressings from './pages/Dressings';
import Condiments from './pages/Condiments';
import PrivateLabel from './pages/PrivateLabel';
import FarEastSauce from './pages/FarEastSauce';
import Toppings from './pages/Toppings';
import DixieKids from './pages/DixieKids';
import ProfessionalSauce from './pages/ProfessionalSauce';
import ScrollToTop from './components/ScrollToTop';
import DynamicProductPage from './pages/DynamicProductPage';

// Import new pages
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Search from './pages/Search';
import ProductDetails from './pages/ProductDetails';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

/* Admin imports */
import AdminLogin from './admin/Login';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminDashboard from './admin/Dashboard';
import AdminOverview from './admin/pages/Overview';
import AdminLanding from './admin/pages/LandingSettings';
import AdminHeader from './admin/pages/Header';
import AdminFooter from './admin/pages/Footer';
import AdminBrands from './admin/pages/Brands';
import AdminCategories from './admin/pages/Categories';
import AdminProducts from './admin/pages/Products';
import AdminServices from './admin/pages/Services';
import AdminAbout from './admin/pages/About';
import AdminContact from './admin/pages/Contact';
import AdminCollapsible from './admin/pages/Collapsible';
import AdminLanguages from './admin/pages/Languages';
import AdminOrders from './admin/pages/Orders';
import AdminProductDetails from './admin/pages/ProductDetails';
import AdminChatbotSettings from './admin/pages/ChatbotSettings';
import AdminBlogPosts from './admin/pages/BlogPosts';
import AdminBlogCategories from './admin/pages/BlogCategories';
import AdminBlogTags from './admin/pages/BlogTags';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', // Red - like Dixie Mills
      light: '#FF6659',
      dark: '#9A0007',
    },
    secondary: {
      main: '#FFC107', // Amber/Yellow - food industry
      light: '#FFD54F',
      dark: '#F57C00',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Home page component
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <NewArrivals />
      <TrustedBrands />
      <CollapsibleContent />
      <MapLocation />
      <Footer />
    </>
  );
};

 // Component to conditionally render Header
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProductDetailsRoute = location.pathname.startsWith('/product/');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <FloatingActions />}
      {!isAdminRoute && !isProductDetailsRoute && <Header />}
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<Search />} />
          {/* Food product routes */}
          <Route path="/sauces" element={<Sauces />} />
          <Route path="/ketchup" element={<Ketchup />} />
          <Route path="/mayonnaise" element={<Mayonnaise />} />
          <Route path="/dressings" element={<Dressings />} />
          <Route path="/condiments" element={<Condiments />} />
          <Route path="/far-east-sauce" element={<FarEastSauce />} />
          <Route path="/toppings" element={<Toppings />} />
          <Route path="/dixie-kids" element={<DixieKids />} />
          <Route path="/professional-sauce" element={<ProfessionalSauce />} />
          <Route path="/private-label" element={<PrivateLabel />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          
          {/* Dynamic route for custom navigation items - catches any unmatched route */}
          <Route path="/:slug" element={<DynamicProductPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="languages" element={<AdminLanguages />} />
            <Route path="landing" element={<AdminLanding />} />
            <Route path="header" element={<AdminHeader />} />
            <Route path="footer" element={<AdminFooter />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="product-details" element={<AdminProductDetails />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="collapsible" element={<AdminCollapsible />} />
            <Route path="chatbot" element={<AdminChatbotSettings />} />
            <Route path="blog-posts" element={<AdminBlogPosts />} />
            <Route path="blog-categories" element={<AdminBlogCategories />} />
            <Route path="blog-tags" element={<AdminBlogTags />} />
          </Route>
        </Routes>
      </PageTransition>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <LanguageProvider>
          <Router>
            <AppContent />
            <LoadingSpinner />
          </Router>
        </LanguageProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
