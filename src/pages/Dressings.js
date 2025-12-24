
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
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dressings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default dressing products
  const defaultProducts = [
    {
      id: 1,
      name: 'Ranch Dressing',
      description: 'Creamy buttermilk ranch with herbs and spices',
      price: '$4.49',
      size: '16 oz',
      image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=600&q=80',
      features: ['America\'s Favorite', 'Made with Buttermilk', 'No MSG'],
      bestseller: true,
    },
    {
      id: 2,
      name: 'Italian Dressing',
      description: 'Zesty blend of herbs, garlic, and vinegar',
      price: '$3.99',
      size: '16 oz',
      image_url: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=600&q=80',
      features: ['Classic Recipe', 'Perfect for Marinades', 'Fat Free Option'],
    },
    {
      id: 3,
      name: 'Caesar Dressing',
      description: 'Rich and savory with parmesan and anchovies',
      price: '$5.49',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=600&q=80',
      features: ['Restaurant Style', 'Real Parmesan', 'Bold Flavor'],
      premium: true,
    },
    {
      id: 4,
      name: 'Honey Mustard',
      description: 'Sweet and tangy blend perfect for salads and dipping',
      price: '$4.29',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=600&q=80',
      features: ['Real Honey', 'Kid Favorite', 'Versatile'],
    },
    {
      id: 5,
      name: 'Balsamic Vinaigrette',
      description: 'Aged balsamic vinegar with olive oil and herbs',
      price: '$5.99',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=600&q=80',
      features: ['Imported Vinegar', 'Heart Healthy', 'Low Calorie'],
      gourmet: true,
    },
    {
      id: 6,
      name: 'Thousand Island',
      description: 'Creamy and tangy with pickle relish',
      price: '$4.49',
      size: '16 oz',
      image_url: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=600&q=80',
      features: ['Classic Taste', 'Great on Burgers', 'Family Recipe'],
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('dressings', currentLanguage);
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
            <Typography color="text.primary">Salad Dressings</Typography>
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
              Salad Dressings
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Transform your salads with our delicious range of dressings, from classic ranch to gourmet vinaigrettes
            </Typography>
          </Box>

          {/* Fresh Ingredients Banner */}
          <Paper
            sx={{
              backgroundColor: '#E8F5E9',
              p: 4,
              mb: 6,
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <LocalFloristIcon sx={{ fontSize: 48, color: '#2E7D32', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Made with Fresh Ingredients
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575', maxWidth: '600px', mx: 'auto' }}>
              We use real herbs, spices, and quality oils to create dressings that make every salad special
            </Typography>
          </Paper>

          {/* Filter Chips */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="All Dressings"
              onClick={() => {}}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Creamy"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Vinaigrettes"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Low Calorie"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Gourmet"
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
              <CircularProgress sx={{ color: '#689F38' }} />
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
                              backgroundColor: '#689F38',
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
                                backgroundColor: '#E8F5E9',
                                color: '#2E7D32',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                        </Box>

                        {/* Price and Action */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: '#689F38' }}
                          >
                            {product.price}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#689F38',
                              '&:hover': {
                                backgroundColor: '#558B2F',
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

          {/* Salad Pairing Guide */}
          <Box
            sx={{
              backgroundColor: '#F1F8E9',
              borderRadius: '16px',
              p: 6,
              mb: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
              Perfect Pairings Guide
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🥗</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Garden Salad
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Best with: Ranch, Italian, or Balsamic
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🥬</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Caesar Salad
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Best with: Caesar Dressing
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🍗</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Chicken Salad
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Best with: Honey Mustard or Ranch
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🍅</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Caprese Salad
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Best with: Balsamic Vinaigrette
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Call to Action */}
          <Box
            sx={{
              backgroundColor: '#E3F2FD',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Create Your Own Signature Dressing
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575', mb: 3, maxWidth: '600px', mx: 'auto' }}>
              Looking for a custom dressing for your restaurant or food service? We can create unique flavors just for you.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/private-label')}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': {
                  backgroundColor: '#1565C0',
                },
              }}
            >
              Explore Custom Options
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Dressings;