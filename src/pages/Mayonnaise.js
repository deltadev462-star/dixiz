
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
import EggIcon from '@mui/icons-material/Egg';
import VerifiedIcon from '@mui/icons-material/Verified';
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Mayonnaise = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default mayonnaise products
  const defaultProducts = [
    {
      id: 1,
      name: 'Classic Mayonnaise',
      description: 'Rich and creamy traditional mayonnaise',
      price: '$4.99',
      size: '30 oz',
      image_url: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=600&q=80',
      features: ['Real Eggs', 'No Artificial Flavors', 'Gluten Free'],
      bestseller: true,
    },
    {
      id: 2,
      name: 'Light Mayonnaise',
      description: '50% less fat and calories than regular mayo',
      price: '$4.49',
      size: '30 oz',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80',
      features: ['50% Less Fat', 'Same Great Taste', 'Heart Healthy'],
    },
    {
      id: 3,
      name: 'Olive Oil Mayonnaise',
      description: 'Made with extra virgin olive oil for a lighter taste',
      price: '$5.99',
      size: '24 oz',
      image_url: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=600&q=80',
      features: ['Extra Virgin Olive Oil', 'Mediterranean Style', 'Omega-3 Rich'],
      premium: true,
    },
    {
      id: 4,
      name: 'Vegan Mayo',
      description: 'Plant-based mayo that tastes like the real thing',
      price: '$5.49',
      size: '24 oz',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80',
      features: ['100% Plant-Based', 'Egg Free', 'Non-GMO'],
      vegan: true,
    },
    {
      id: 5,
      name: 'Garlic Aioli',
      description: 'Creamy mayonnaise infused with roasted garlic',
      price: '$6.49',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=600&q=80',
      features: ['Gourmet Flavor', 'Real Garlic', 'Perfect for Sandwiches'],
      gourmet: true,
    },
    {
      id: 6,
      name: 'Chipotle Mayo',
      description: 'Smoky chipotle peppers blended with creamy mayo',
      price: '$5.99',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80',
      features: ['Spicy & Smoky', 'Authentic Chipotle', 'Versatile'],
      gourmet: true,
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('mayonnaise', currentLanguage);
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
            <Typography color="text.primary">Mayonnaise & Aioli</Typography>
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
              Mayonnaise & Aioli
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Creamy, rich mayonnaise made with the finest ingredients for perfect sandwiches and salads
            </Typography>
          </Box>

          {/* Quality Features */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#FFF9C4',
                  borderRadius: '12px',
                }}
              >
                <EggIcon sx={{ fontSize: 48, color: '#F57F17', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Made with Real Eggs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We use only cage-free eggs for superior taste and quality
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#E8F5E9',
                  borderRadius: '12px',
                }}
              >
                <VerifiedIcon sx={{ fontSize: 48, color: '#2E7D32', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  No Artificial Preservatives
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clean ingredients you can trust in every jar
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#F3E5F5',
                  borderRadius: '12px',
                }}
              >
                <Typography sx={{ fontSize: 48, mb: 2 }}>🥄</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Perfect Consistency
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smooth and creamy texture that spreads perfectly
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Filter Chips */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="All Mayo"
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
              label="Light & Healthy"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Vegan"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Gourmet Aioli"
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
              <CircularProgress sx={{ color: '#FFC107' }} />
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
                              backgroundColor: '#FFC107',
                              color: '#212121',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {product.vegan && (
                          <Chip
                            label="Vegan"
                            size="small"
                            sx={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {product.premium && (
                          <Chip
                            label="Premium"
                            size="small"
                            sx={{
                              backgroundColor: '#7B1FA2',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {product.gourmet && (
                          <Chip
                            label="Gourmet"
                            size="small"
                            sx={{
                              backgroundColor: '#FF6F00',
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
                                backgroundColor: '#FFF9C4',
                                color: '#F57F17',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                        </Box>

                        {/* Price and Action */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: '#F57F17' }}
                          >
                            {product.price}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#FFC107',
                              color: '#212121',
                              '&:hover': {
                                backgroundColor: '#F57F17',
                                color: 'white',
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

          {/* Usage Tips */}
          <Box
            sx={{
              backgroundColor: '#FFF9C4',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Pro Tips for Using Our Mayo
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🥪 Sandwich Spread
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Spread evenly on both slices of bread for the perfect sandwich
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🥗 Salad Dressing Base
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mix with herbs and lemon juice for a creamy salad dressing
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🍤 Dipping Sauce
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Combine with sriracha or garlic for an instant dipping sauce
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Mayonnaise;