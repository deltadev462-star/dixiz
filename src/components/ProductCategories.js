import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Fade,
  Chip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchCategories, fetchSiteSettings } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';

const ProductCategories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('Our Product Categories');
  const { currentLanguage } = useLanguage();

  // Default food categories
  const defaultCategories = [
    {
      id: 1,
      name: 'Ketchup & Tomato Sauces',
      slug: 'ketchup',
      image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80',
      description: 'Classic and gourmet ketchup varieties',
      color: '#D32F2F',
    },
    {
      id: 2,
      name: 'Mayonnaise & Aioli',
      slug: 'mayonnaise',
      image_url: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=400&q=80',
      description: 'Creamy mayonnaise and flavored aiolis',
      color: '#FFF9C4',
    },
    {
      id: 3,
      name: 'BBQ & Hot Sauces',
      slug: 'sauces',
      image_url: 'https://images.unsplash.com/photo-1541025317620-f74b8e1e63c9?auto=format&fit=crop&w=400&q=80',
      description: 'Bold BBQ and spicy hot sauces',
      color: '#BF360C',
    },
    {
      id: 4,
      name: 'Salad Dressings',
      slug: 'dressings',
      image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=400&q=80',
      description: 'Ranch, Italian, and specialty dressings',
      color: '#689F38',
    },
    {
      id: 5,
      name: 'Mustards',
      slug: 'condiments',
      image_url: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=400&q=80',
      description: 'Yellow, Dijon, and specialty mustards',
      color: '#FFC107',
    },
    {
      id: 6,
      name: 'Private Label',
      slug: 'private-label',
      image_url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=400&q=80',
      description: 'Custom solutions for your brand',
      color: '#7B1FA2',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rows, settings] = await Promise.all([
          fetchCategories(currentLanguage),
          fetchSiteSettings(currentLanguage)
        ]);
        if (!cancelled) {
          // Use fetched categories or default to food categories
          setCategories(rows && rows.length > 0 ? rows : defaultCategories);
          if (settings?.categories_title) {
            setSectionTitle(settings.categories_title);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  const handleCategoryClick = (slug) => {
    navigate(`/${slug}`);
  };

  const renderCard = (category, idx) => (
    <Fade in={!loading} timeout={800 + idx * 100} key={category?.slug || idx}>
      <Card
        onClick={() => handleCategoryClick(category.slug)}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '75%',
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
          }}
        >
          <CardMedia
            component="img"
            image={category.image_url}
            alt={category.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          {category.description && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: category.color || '#D32F2F',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              NEW
            </Box>
          )}
        </Box>
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              color: '#212121',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              mb: 1,
            }}
          >
            {category.name}
          </Typography>
          {category.description && (
            <Typography
              variant="body2"
              sx={{
                color: '#757575',
                mb: 2,
                fontSize: '0.875rem',
              }}
            >
              {category.description}
            </Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                color: '#D32F2F',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              Explore Products
              <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Box sx={{ py: 10, backgroundColor: '#FAFAFA' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
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
              color: '#757575',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            From classic condiments to gourmet sauces, discover our full range of premium products
          </Typography>
        </Box>
        
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <CircularProgress
              size={60}
              sx={{
                color: '#D32F2F',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 4,
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {categories.map((category, idx) => renderCard(category, idx))}
          </Box>
        )}
        
        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography
            variant="h5"
            sx={{
              color: '#212121',
              mb: 3,
              fontWeight: 600,
            }}
          >
            Can't find what you're looking for?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              label="Custom Formulations"
              sx={{
                backgroundColor: '#FFF3E0',
                color: '#E65100',
                fontWeight: 600,
                py: 2.5,
                px: 1,
                fontSize: '0.9rem',
              }}
            />
            <Chip
              label="Bulk Orders"
              sx={{
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                fontWeight: 600,
                py: 2.5,
                px: 1,
                fontSize: '0.9rem',
              }}
            />
            <Chip
              label="Private Label"
              sx={{
                backgroundColor: '#F3E5F5',
                color: '#7B1FA2',
                fontWeight: 600,
                py: 2.5,
                px: 1,
                fontSize: '0.9rem',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductCategories;