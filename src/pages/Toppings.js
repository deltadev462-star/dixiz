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
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import IcecreamIcon from '@mui/icons-material/Icecream';
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Toppings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default toppings products
  const defaultProducts = [
    {
      id: 1,
      name: 'Chocolate Syrup',
      description: 'Rich chocolate syrup perfect for ice cream and desserts',
      price: '$3.99',
      image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
      features: ['No High Fructose Corn Syrup', 'Real Cocoa'],
    },
    {
      id: 2,
      name: 'Caramel Sauce',
      description: 'Smooth and creamy caramel topping',
      price: '$4.49',
      image_url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80',
      features: ['All Natural', 'No Preservatives'],
    },
    {
      id: 3,
      name: 'Strawberry Topping',
      description: 'Sweet strawberry topping with real fruit pieces',
      price: '$4.99',
      image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
      features: ['Real Fruit', 'No Artificial Colors'],
    },
    {
      id: 4,
      name: 'Hot Fudge',
      description: 'Thick and rich hot fudge sauce',
      price: '$5.49',
      image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
      features: ['Premium Quality', 'Microwaveable'],
    },
    {
      id: 5,
      name: 'Butterscotch Topping',
      description: 'Classic butterscotch flavor for sundaes',
      price: '$3.99',
      image_url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80',
      features: ['Traditional Recipe', 'Smooth Texture'],
    },
    {
      id: 6,
      name: 'Whipped Cream',
      description: 'Light and fluffy whipped cream topping',
      price: '$2.99',
      image_url: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=600&q=80',
      features: ['Ready to Use', 'Real Dairy'],
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('toppings', currentLanguage);
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
            <Typography color="text.primary">Toppings</Typography>
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
              Delicious Toppings
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Transform your desserts and treats with our premium selection of sweet toppings
            </Typography>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="All Toppings"
              onClick={() => {}}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Syrups"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Fruit Toppings"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Cream & Fudge"
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
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={product.image_url}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        {product.features && product.features.includes('Premium Quality') && (
                          <Chip
                            label="Premium"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              backgroundColor: '#FFC107',
                              color: '#000',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
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
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Call to Action */}
          <Box
            sx={{
              backgroundColor: '#FFF3E0',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
            }}
          >
            <IcecreamIcon sx={{ fontSize: 48, color: '#E65100', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Perfect for Ice Cream Shops & Cafes
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575', mb: 3, maxWidth: '600px', mx: 'auto' }}>
              We offer bulk pricing and custom packaging solutions for ice cream parlors, cafes, and dessert shops.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact-us')}
              sx={{
                backgroundColor: '#E65100',
                '&:hover': {
                  backgroundColor: '#BF360C',
                },
              }}
            >
              Get Bulk Pricing
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Toppings;