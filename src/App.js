import React, { useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LoadingProvider } from './contexts/LoadingContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LoadingSpinner from './components/LoadingSpinner';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
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
import OrderForm from './components/OrderForm';
import PhotoGallery from './components/PhotoGallery';

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

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create ltr cache
const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
});

const ThemeWrapper = ({ children }) => {
  const { currentLanguage } = useLanguage();
  const isRtl = currentLanguage === 'ar';
  
  // Add Google Font that supports Arabic
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  const theme = useMemo(() => createTheme({
    direction: isRtl ? 'rtl' : 'ltr',
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
    fontFamily: isRtl
      ? '"Noto Kufi Arabic", "Roboto", "Helvetica", "Arial", sans-serif'
      : '"Roboto", "Helvetica", "Arial", sans-serif',
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
  }), [isRtl]);
  
  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

// Home page component
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <PhotoGallery />
      <NewArrivals />
      <TrustedBrands />
      <CollapsibleContent />
      <MapLocation />
      <OrderForm />
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
    <LoadingProvider>
      <LanguageProvider>
        <ThemeWrapper>
          <Router>
            <AppContent />
            <LoadingSpinner />
          </Router>
        </ThemeWrapper>
      </LanguageProvider>
    </LoadingProvider>
  );
}

export default App;
