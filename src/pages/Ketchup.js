
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  CircularProgress,
  Fade,
  Paper,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Ketchup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default ketchup products
  const defaultProducts = [
    {
      id: 1,
      name: 'Classic Tomato Ketchup',
      description: 'Our signature recipe made with vine-ripened tomatoes',
      price: '$3.99',
      size: '20 oz',
      image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80',
      features: ['No High Fructose Corn Syrup', 'Non-GMO', 'Gluten Free'],
      bestseller: true,
    },
    {
      id: 2,
      name: 'Organic Ketchup',
      description: '100% organic ingredients, no artificial preservatives',
      price: '$4.99',
      size: '20 oz',
      image_url: 'https://images.unsplash.com/photo-1470072508653-1be229b82d7e?auto=format&fit=crop&w=600&q=80',
      features: ['USDA Organic', 'No Added Sugar', 'Vegan'],
      organic: true,
    },
    {
      id: 3,
      name: 'Spicy Sriracha Ketchup',
      description: 'Classic ketchup with a spicy sriracha kick',
      price: '$4.49',
      size: '18 oz',
      image_url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
      features: ['Spicy Blend', 'Unique Flavor', 'Gluten Free'],
      new: true,
    },
    {
      id: 4,
      name: 'Reduced Sugar Ketchup',
      description: '50% less sugar than regular ketchup',
      price: '$4.29',
      size: '20 oz',
      image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80',
      features: ['50% Less Sugar', 'Same Great Taste', 'Heart Healthy'],
    },
    {
      id: 5,
      name: 'Foodservice Ketchup',
      description: 'Bulk size for restaurants and cafeterias',
      price: '$12.99',
      size: '114 oz',
      image_url: 'https://images.unsplash.com/photo-1470072508653-1be229b82d7e?auto=format&fit=crop&w=600&q=80',
      features: ['Bulk Size', 'Restaurant Quality', 'Easy Pour'],
      bulk: true,
    },
    {
      id: 6,
      name: 'Kids Squeeze Ketchup',
      description: 'Fun squeeze bottle perfect for kids',
      price: '$3.49',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
      features: ['Easy Squeeze', 'No Mess Cap', 'Kid Friendly'],
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('ketchup', currentLanguage);
        if (!cancelled) {
          setProducts(data && data.length > 0 ? data : defaultProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (!cancelled) {
          setProducts(defaultProducts);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh', pt: 3 }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 4 }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/products"
              onClick={(e) => {
                e.preventDefault();
                navigate('/products');
              }}
            >
              Products
            </Link>
            <Typography color="text.primary">Ketchup & Tomato Sauces</Typography>
          </Breadcrumbs>

          {/* Page Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#212121',
                mb: 2,
              }}
            >
              Ketchup & Tomato Sauces
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              America's favorite condiment, made with the finest tomatoes and our time-tested recipes
            </Typography>
          </Box>

          {/* Quality Promise Banner */}
          <Paper
            sx={{
              backgroundColor: '#FFEBEE',
              p: 4,
              mb: 6,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#D32F2F' }} />
              <Typography sx={{ fontWeight: 600 }}>Made with Real Tomatoes</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#D32F2F' }} />
              <Typography sx={{ fontWeight: 600 }}>No Artificial Colors</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#D32F2F' }} />
              <Typography sx={{ fontWeight: 600 }}>Family Recipe Since 1947</Typography>
            </Box>
          </Paper>

          {/* Filter Chips */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="All Ketchup"
              onClick={() => {}}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Classic"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Organic"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Specialty"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Bulk Sizes"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Products Grid */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
              }}
            >
              <CircularProgress sx={{ color: '#D32F2F' }} />
            </Box>
          ) : (
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Fade in timeout={800 + index * 100}>
                    <Card
                      onClick={() => handleProductClick(product.id)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      {/* Badges */}
                      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, display: 'flex', gap: 1, flexDirection: 'column' }}>
                        {product.bestseller && (
                          <Chip
                            label="Bestseller"
                            size="small"
                            sx={{
                              backgroundColor: '#D32F2F',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {product.new && (
                          <Chip
                            label="New"
                            size="small"
                            sx={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {product.organic && (
                          <Chip
                            label="Organic"
                            size="small"
                            sx={{
                              backgroundColor: '#689F38',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>

                      <CardMedia
                        component="img"
                        height="250"
                        image={product.image_url}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {product.description}
                        </Typography>
                        
                        {/* Size */}
                        <Typography
                          variant="body2"
                          sx={{ color: '#757575', mb: 2 }}
                        >
                          Size: {product.size}
                        </Typography>

                        {/* Features */}
                        <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {product.features && product.features.map((feature, idx) => (
                            <Chip
                              key={idx}
                              label={feature}
                              size="small"
                              sx={{
                                backgroundColor: '#FFF3E0',
                                color: '#E65100',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                        </Box>

                        {/* Price and Action */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: '#D32F2F' }}
                          >
                            {product.price}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#D32F2F',
                              '&:hover': {
                                backgroundColor: '#B71C1C',
                              },
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Recipe Ideas Section */}
          <Box
            sx={{
              backgroundColor: '#FFF3E0',
              borderRadius: '16px',
              p: 6,
              mb: 8,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LocalDiningIcon sx={{ fontSize: 48, color: '#E65100', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Recipe Ideas with Our Ketchup
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Homemade BBQ Sauce
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mix our ketchup with brown sugar, vinegar, and spices for a quick BBQ sauce
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Sweet & Sour Glaze
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Combine ketchup with soy sauce and honey for an Asian-inspired glaze
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Cocktail Sauce
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mix ketchup with horseradish and lemon juice for the perfect seafood sauce
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Bulk Orders CTA */}
          <Box
            sx={{
              backgroundColor: '#E8F5E9',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Need Ketchup in Bulk?
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575', mb: 3, maxWidth: '600px', mx: 'auto' }}>
              We offer special pricing for restaurants, schools, and foodservice operations. Available in gallons and cases.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact-us')}
              sx={{
                backgroundColor: '#2E7D32',
                '&:hover': {
                  backgroundColor: '#1B5E20',
                },
              }}
            >
              Request Bulk Pricing
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Ketchup;