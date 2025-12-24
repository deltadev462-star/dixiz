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
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfessionalSauce = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default professional sauce products
  const defaultProducts = [
    {
      id: 1,
      name: 'Bulk BBQ Sauce - 1 Gallon',
      description: 'Restaurant-grade BBQ sauce in bulk packaging',
      price: '$24.99',
      image_url: 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=600&q=80',
      features: ['Food Service Size', 'Consistent Quality', 'Bulk Pricing'],
      size: '1 Gallon',
    },
    {
      id: 2,
      name: 'Professional Mayo - 5L',
      description: 'Premium mayonnaise for commercial kitchens',
      price: '$19.99',
      image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80',
      features: ['Long Shelf Life', 'No Separation', 'Easy Dispensing'],
      size: '5 Liters',
    },
    {
      id: 3,
      name: 'Chef\'s Hot Sauce Collection',
      description: 'Variety pack of premium hot sauces for restaurants',
      price: '$89.99',
      image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80',
      features: ['6 Varieties', 'Display Ready', 'Recipe Cards'],
      size: '6 x 750ml',
    },
    {
      id: 4,
      name: 'Gourmet Aioli Base - 2.5kg',
      description: 'Versatile aioli base for custom flavor creation',
      price: '$34.99',
      image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
      features: ['Neutral Base', 'Mix-In Ready', 'Premium Ingredients'],
      size: '2.5kg',
    },
    {
      id: 5,
      name: 'Signature Steak Sauce - Case',
      description: 'Premium steak sauce for fine dining establishments',
      price: '$149.99',
      image_url: 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=600&q=80',
      features: ['Case of 12', 'Aged Recipe', 'White Label Option'],
      size: '12 x 500ml',
    },
    {
      id: 6,
      name: 'Industrial Ketchup Dispenser Pack',
      description: 'Ketchup designed for pump dispensers',
      price: '$39.99',
      image_url: 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?auto=format&fit=crop&w=600&q=80',
      features: ['Pump Compatible', 'No Clogging', 'Portion Control'],
      size: '2 x 3L',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('professional-sauce', currentLanguage);
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
      <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', pt: 3 }}>
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
            <Typography color="text.primary">Professional Sauces</Typography>
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
              Professional Food Service Solutions
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Bulk sauces and condiments designed for restaurants, catering, and institutional use
            </Typography>
          </Box>

          {/* Benefits Bar */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalShippingIcon sx={{ fontSize: 40, color: '#D32F2F', mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Free Delivery</Typography>
              <Typography variant="caption" color="text.secondary">Orders over $500</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <RestaurantMenuIcon sx={{ fontSize: 40, color: '#D32F2F', mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Chef Approved</Typography>
              <Typography variant="caption" color="text.secondary">Tested by professionals</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#D32F2F', mb: 1, fontWeight: 700 }}>30+</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Years Experience</Typography>
              <Typography variant="caption" color="text.secondary">Serving food service</Typography>
            </Box>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="All Products"
              onClick={() => {}}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Bulk Sizes"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Dispenser Packs"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Case Quantities"
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
                        backgroundColor: '#FFFFFF',
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
                        {product.size && (
                          <Chip
                            label={product.size}
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: 16,
                              right: 16,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: 'white',
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
                                backgroundColor: '#E3F2FD',
                                color: '#1565C0',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                        </Box>

                        {/* Price and Action */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: 700, color: '#D32F2F' }}
                            >
                              {product.price}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Wholesale pricing available
                            </Typography>
                          </Box>
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
                            Get Quote
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
              background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
              color: 'white',
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Custom Solutions for Your Business
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto', opacity: 0.9 }}>
              We offer custom formulations, private labeling, and specialized packaging solutions for restaurants, hotels, catering companies, and food service distributors.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/private-label')}
                sx={{
                  backgroundColor: 'white',
                  color: '#1565C0',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                  },
                }}
              >
                Private Label Options
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/contact-us')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Request Catalog
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ProfessionalSauce;