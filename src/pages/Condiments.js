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
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Condiments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default condiment products
  const defaultProducts = [
    {
      id: 1,
      name: 'Yellow Mustard',
      description: 'Classic American yellow mustard with a tangy kick',
      price: '$2.99',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80',
      features: ['Classic Flavor', 'No Artificial Colors', 'Squeeze Bottle'],
      bestseller: true,
    },
    {
      id: 2,
      name: 'Dijon Mustard',
      description: 'Smooth French-style mustard with white wine',
      price: '$4.49',
      size: '8 oz',
      image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
      features: ['Imported Recipe', 'Gourmet Quality', 'Perfect for Cooking'],
      premium: true,
    },
    {
      id: 3,
      name: 'Sweet Pickle Relish',
      description: 'Chopped pickles with sweet and tangy flavor',
      price: '$3.49',
      size: '10 oz',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80',
      features: ['Perfect for Hot Dogs', 'No High Fructose Corn Syrup', 'Crunchy'],
    },
    {
      id: 4,
      name: 'Horseradish Sauce',
      description: 'Creamy horseradish with a powerful kick',
      price: '$3.99',
      size: '8 oz',
      image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
      features: ['Extra Hot', 'Real Horseradish', 'Great with Beef'],
      spicy: true,
    },
    {
      id: 5,
      name: 'Honey Mustard',
      description: 'Sweet and savory blend of honey and mustard',
      price: '$3.79',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=600&q=80',
      features: ['Real Honey', 'Kid Friendly', 'Great for Dipping'],
    },
    {
      id: 6,
      name: 'Spicy Brown Mustard',
      description: 'Coarse ground mustard seeds with bold flavor',
      price: '$3.29',
      size: '12 oz',
      image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
      features: ['Stone Ground', 'Bold & Spicy', 'Deli Style'],
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('condiments', currentLanguage);
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
            <Typography color="text.primary">Mustards & Condiments</Typography>
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
              Mustards & Condiments
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Essential condiments that add flavor and excitement to every meal
            </Typography>
          </Box>

          {/* Category Banner */}
          <Box
            sx={{
              backgroundColor: '#FFF8E1',
              borderRadius: '16px',
              p: 4,
              mb: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 48, color: '#F57C00' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                The Perfect Complement
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575' }}>
                From ballpark classics to gourmet selections, find the perfect condiment for any dish
              </Typography>
            </Box>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="All Condiments"
              onClick={() => {}}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Mustards"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Relishes"
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
                        {product.spicy && (
                          <Chip
                            label="Spicy"
                            size="small"
                            sx={{
                              backgroundColor: '#D32F2F',
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
                                backgroundColor: '#FFF8E1',
                                color: '#F57C00',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                        </Box>

                        {/* Price and Action */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: '#F57C00' }}
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
                                backgroundColor: '#F57C00',
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

          {/* Usage Ideas */}
          <Box
            sx={{
              backgroundColor: '#FFF3E0',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
              Perfect Pairings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>🌭</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Hot Dogs & Sausages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yellow mustard, spicy brown mustard, or sweet relish
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>🍔</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Burgers & Sandwiches
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dijon mustard, pickle relish, or honey mustard
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>🥩</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Steaks & Roasts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Horseradish sauce or whole grain mustard
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Condiments;