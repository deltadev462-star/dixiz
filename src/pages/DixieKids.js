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
import ChildCareIcon from '@mui/icons-material/ChildCare';
import StarIcon from '@mui/icons-material/Star';
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DixieKids = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default kids products
  const defaultProducts = [
    {
      id: 1,
      name: 'Mild Tomato Ketchup',
      description: 'Kid-friendly ketchup with less sugar and no spices',
      price: '$3.49',
      image_url: 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?auto=format&fit=crop&w=600&q=80',
      features: ['No Added Sugar', 'Kid Approved', 'Organic'],
      age_group: '3+',
    },
    {
      id: 2,
      name: 'Honey BBQ Sauce',
      description: 'Sweet and mild BBQ sauce perfect for chicken nuggets',
      price: '$3.99',
      image_url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
      features: ['All Natural', 'No Artificial Colors', 'Mild'],
      age_group: '3+',
    },
    {
      id: 3,
      name: 'Cheese Dip',
      description: 'Creamy cheese sauce for veggies and snacks',
      price: '$4.49',
      image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
      features: ['Real Cheese', 'Calcium Rich', 'No Preservatives'],
      age_group: '2+',
    },
    {
      id: 4,
      name: 'Apple Sauce',
      description: 'Smooth apple sauce with no added sugars',
      price: '$2.99',
      image_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80',
      features: ['100% Fruit', 'No Sugar Added', 'Vitamin C'],
      age_group: '6m+',
    },
    {
      id: 5,
      name: 'Ranch Dressing',
      description: 'Mild ranch perfect for veggie dipping',
      price: '$3.49',
      image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=600&q=80',
      features: ['Low Sodium', 'Hidden Veggies', 'Probiotic'],
      age_group: '2+',
    },
    {
      id: 6,
      name: 'Strawberry Spread',
      description: 'Fruit spread with real strawberries and less sugar',
      price: '$4.99',
      image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
      features: ['Real Fruit', '50% Less Sugar', 'No HFCS'],
      age_group: '1+',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('dixie-kids', currentLanguage);
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
            <Typography color="text.primary">Dixie Kids</Typography>
          </Breadcrumbs>

          {/* Page Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
              <ChildCareIcon sx={{ fontSize: 48, color: '#FFC107' }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#212121',
                }}
              >
                Dixie Kids
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Delicious and nutritious sauces specially crafted for little taste buds
            </Typography>
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
              label="Baby (6m+)"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Toddler (1+)"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Kids (3+)"
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
                        border: '2px solid transparent',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                          borderColor: '#FFC107',
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
                        {product.age_group && (
                          <Chip
                            label={`Age ${product.age_group}`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {product.features && product.features.includes('Kid Approved') && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              backgroundColor: '#FFC107',
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <StarIcon sx={{ color: 'white', fontSize: 24 }} />
                          </Box>
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
                            sx={{ fontWeight: 700, color: '#D32F2F' }}
                          >
                            {product.price}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#FFC107',
                              color: '#000',
                              '&:hover': {
                                backgroundColor: '#FFB300',
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
              background: 'linear-gradient(135deg, #FFE082 0%, #FFD54F 100%)',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
            }}
          >
            <ChildCareIcon sx={{ fontSize: 48, color: '#F57C00', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Nutrition Parents Trust
            </Typography>
            <Typography variant="body1" sx={{ color: '#424242', mb: 3, maxWidth: '600px', mx: 'auto' }}>
              All Dixie Kids products are developed with pediatric nutritionists to ensure they're both healthy and delicious. No artificial colors, flavors, or high fructose corn syrup.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/about-us')}
              sx={{
                backgroundColor: '#F57C00',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#E65100',
                },
              }}
            >
              Learn About Our Standards
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default DixieKids;