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
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { fetchProductsByCategorySlug } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Sauces = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentLanguage } = useLanguage();

  // Default sauce products
  const defaultProducts = [
    {
      id: 1,
      name: 'Classic BBQ Sauce',
      description: 'Sweet and tangy barbecue sauce with a hint of smoke',
      price: '$4.99',
      image_url: 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=600&q=80',
      features: ['No High Fructose Corn Syrup', 'Gluten Free'],
      spice_level: 1,
    },
    {
      id: 2,
      name: 'Honey Mustard BBQ',
      description: 'Perfect blend of honey sweetness and mustard tang',
      price: '$5.49',
      image_url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
      features: ['All Natural', 'No Preservatives'],
      spice_level: 1,
    },
    {
      id: 3,
      name: 'Chipotle Hot Sauce',
      description: 'Smoky chipotle peppers with a fiery kick',
      price: '$4.49',
      image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80',
      features: ['Vegan', 'Non-GMO'],
      spice_level: 4,
    },
    {
      id: 4,
      name: 'Carolina Gold BBQ',
      description: 'Mustard-based BBQ sauce with Southern charm',
      price: '$5.99',
      image_url: 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=600&q=80',
      features: ['Regional Favorite', 'Award Winning'],
      spice_level: 2,
    },
    {
      id: 5,
      name: 'Ghost Pepper Extreme',
      description: 'For the brave souls who love extreme heat',
      price: '$6.99',
      image_url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
      features: ['Extreme Heat', 'Limited Edition'],
      spice_level: 5,
    },
    {
      id: 6,
      name: 'Teriyaki Glaze',
      description: 'Sweet and savory Asian-inspired sauce',
      price: '$5.49',
      image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80',
      features: ['Low Sodium', 'Authentic Recipe'],
      spice_level: 0,
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductsByCategorySlug('sauces', currentLanguage);
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

  const renderSpiceLevel = (level) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {[...Array(5)].map((_, index) => (
          <LocalFireDepartmentIcon
            key={index}
            sx={{
              fontSize: '1rem',
              color: index < level ? '#D32F2F' : '#E0E0E0',
            }}
          />
        ))}
      </Box>
    );
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
            <Typography color="text.primary">BBQ & Hot Sauces</Typography>
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
              BBQ & Hot Sauces
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#757575',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              From mild and sweet to blazing hot, our sauce collection brings bold flavors to every meal
            </Typography>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="All Sauces"
              onClick={() => {}}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="BBQ Sauces"
              onClick={() => {}}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Hot Sauces"
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
                        {product.features && product.features.includes('Limited Edition') && (
                          <Chip
                            label="Limited Edition"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              backgroundColor: '#D32F2F',
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
                        
                        {/* Spice Level */}
                        {product.spice_level !== undefined && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#757575', mb: 0.5 }}>
                              Spice Level
                            </Typography>
                            {renderSpiceLevel(product.spice_level)}
                          </Box>
                        )}

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
            <RestaurantIcon sx={{ fontSize: 48, color: '#E65100', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Looking for Custom Sauce Solutions?
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575', mb: 3, maxWidth: '600px', mx: 'auto' }}>
              We offer private label and custom formulation services for restaurants, retailers, and food service providers.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/private-label')}
              sx={{
                backgroundColor: '#E65100',
                '&:hover': {
                  backgroundColor: '#BF360C',
                },
              }}
            >
              Learn About Private Label
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Sauces;