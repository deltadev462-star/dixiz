
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { ShoppingCart, Info, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { fetchNewProducts, fetchSiteSettings } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const NewArrivals = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('New Arrivals');
  const [sectionSubtitle, setSectionSubtitle] = useState('Fresh flavors just added! Be the first to taste our latest creations.');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Default new food products
  const defaultProducts = [
    {
      id: 1,
      name: 'Smoky Chipotle Ranch',
      brand: 'Dixie Mills Gourmet',
      image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=600&q=80',
      price_display: '$5.99',
      is_new: true,
      category: 'Dressings',
    },
    {
      id: 2,
      name: 'Honey Sriracha Ketchup',
      brand: 'Dixie Mills',
      image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80',
      price_display: '$4.49',
      is_new: true,
      category: 'Ketchup',
    },
    {
      id: 3,
      name: 'Truffle Aioli',
      brand: 'Dixie Mills Premium',
      image_url: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=600&q=80',
      price_display: '$7.99',
      is_new: true,
      category: 'Mayonnaise',
    },
    {
      id: 4,
      name: 'Carolina Reaper Hot Sauce',
      brand: 'Dixie Mills',
      image_url: 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=600&q=80',
      price_display: '$6.99',
      is_new: true,
      category: 'Hot Sauces',
    },
    {
      id: 5,
      name: 'Maple Bourbon BBQ',
      brand: 'Dixie Mills Gourmet',
      image_url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
      price_display: '$5.49',
      is_new: true,
      category: 'BBQ Sauces',
    },
    {
      id: 6,
      name: 'Lemon Herb Vinaigrette',
      brand: 'Dixie Mills',
      image_url: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=600&q=80',
      price_display: '$4.99',
      is_new: true,
      category: 'Dressings',
    },
    {
      id: 7,
      name: 'Spicy Garlic Mayo',
      brand: 'Dixie Mills',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80',
      price_display: '$5.49',
      is_new: true,
      category: 'Mayonnaise',
    },
    {
      id: 8,
      name: 'Sweet & Tangy Mustard',
      brand: 'Dixie Mills',
      image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
      price_display: '$3.99',
      is_new: true,
      category: 'Mustards',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rows, settings] = await Promise.all([
          fetchNewProducts(currentLanguage),
          fetchSiteSettings(currentLanguage)
        ]);
        if (!cancelled) {
          setAllProducts(rows && rows.length > 0 ? rows : defaultProducts);
          if (settings?.new_arrivals_title) {
            setSectionTitle(settings.new_arrivals_title);
          }
          if (settings?.new_arrivals_subtitle) {
            setSectionSubtitle(settings.new_arrivals_subtitle);
          }
        }
      } catch {
        if (!cancelled) setAllProducts(defaultProducts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  // Calculate items to show based on screen size
  const itemsToShow = isMobile ? 1 : isTablet ? 2 : 4;

  // When data changes or screen size changes, make sure the index is valid
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsToShow, loading]);

  const productsLength = loading ? 8 : allProducts.length || 0;
  const maxIndex = Math.max(0, Math.ceil(productsLength / itemsToShow) - 1);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const gapPx = isMobile ? 16 : isTablet ? 16 : 32;

  return (
    <Box sx={{ py: 8, backgroundColor: '#FFF8E1' }}>
      <Container maxWidth="lg" sx={{ overflow: 'visible' }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              color: '#212121',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            {sectionTitle}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            {sectionSubtitle}
          </Typography>
        </Box>

        {/* Carousel Container */}
        <Box sx={{ position: 'relative', px: { xs: 5, sm: 6, md: 0 } }}>
          {/* Navigation Buttons */}
          <IconButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            sx={{
              position: 'absolute',
              left: { xs: 0, sm: -20, md: -48 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: 2,
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              '&:hover': {
                backgroundColor: 'white',
                boxShadow: 4,
              },
              '&:disabled': {
                opacity: 0.3,
              },
            }}
            aria-label="Previous"
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            sx={{
              position: 'absolute',
              right: { xs: 0, sm: -20, md: -48 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: 2,
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              '&:hover': {
                backgroundColor: 'white',
                boxShadow: 4,
              },
              '&:disabled': {
                opacity: 0.3,
              },
            }}
            aria-label="Next"
          >
            <ChevronRight />
          </IconButton>

          {/* Products Carousel */}
          <Box
            sx={{
              overflow: 'hidden',
              mx: { xs: 1, sm: 0 },
              pb: 2, // Add padding bottom to ensure cards aren't cut off
            }}
          >
            <Box
              sx={{
                display: 'flex',
                transition: 'transform 0.5s ease-in-out',
                transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * gapPx}px))`,
                pb: 1, // Additional padding for box shadow
              }}
            >
              {(loading ? Array.from({ length: 8 }) : allProducts).map((product, index) => (
                <Card
                  key={loading ? `s-${index}` : product.id}
                  sx={{
                    flex: '0 0 auto',
                    width: `calc(${100 / itemsToShow}% - ${(gapPx * (itemsToShow - 1)) / itemsToShow}px)`,
                    marginRight:
                      index === (loading ? 7 : allProducts.length - 1) ? 0 : { xs: '16px', md: '32px' },
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                    position: 'relative',
                  }}
                >
                  {!loading && product.is_new && (
                    <Chip
                      label={t('label.new', 'NEW')}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        fontWeight: 'bold',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '75%', // 4:3 aspect ratio for product cards
                      overflow: 'hidden',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0 }} />
                    ) : (
                      <CardMedia
                        component="img"
                        image={product.image_url}
                        alt={product.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    {loading ? (
                      <>
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="rectangular" width={80} height={24} sx={{ mt: 1, mb: 2 }} />
                        <Skeleton variant="text" width="50%" height={36} />
                      </>
                    ) : (
                      <>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                            mb: 1,
                          }}
                        >
                          {product.name}
                        </Typography>
                        {product.brand && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {product.brand}
                          </Typography>
                        )}
                        {product.category && (
                          <Chip
                            label={product.category}
                            size="small"
                            sx={{
                              mb: 2,
                              backgroundColor: '#FFF3E0',
                              color: '#E65100',
                            }}
                          />
                        )}
                        {product.price_display && (
                          <Typography
                            variant="h5"
                            component="p"
                            sx={{
                              color: '#D32F2F',
                              fontWeight: 700,
                              fontSize: { xs: '1.5rem', md: '1.75rem' },
                            }}
                          >
                            {product.price_display}
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<Info />}
                      sx={{
                        flexGrow: 1,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                      }}
                      disabled={loading}
                      onClick={() => handleProductDetails(product.id)}
                    >
                      {t('button.details', 'Details')}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      sx={{
                        flexGrow: 1,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        backgroundColor: '#D32F2F',
                        '&:hover': {
                          backgroundColor: '#B71C1C',
                        },
                      }}
                      disabled={loading}
                      onClick={() => handleProductDetails(product.id)}
                    >
                      {t('button.add_to_cart', 'Add to Cart')}
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Dots Navigation */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 4,
            mb: 2, // Add margin bottom to create space
          }}
        >
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: index === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === currentIndex ? '#D32F2F' : 'grey.400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: index === currentIndex ? '#B71C1C' : 'grey.600',
                },
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default NewArrivals;