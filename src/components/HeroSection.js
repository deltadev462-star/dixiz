import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchSiteSettings } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    hero_title: 'Dixie Mills — Your Home for Sauces, Ketchup, and Mayonnaise!',
    hero_subtitle:
      'Delicious flavors. Quality ingredients. Discover our mouth-watering sauces, rich ketchup, and creamy mayonnaise—perfect for every meal.',
    hero_image_url:
      'https://images.unsplash.com/photo-1613564834361-9436948817d1?auto=format&fit=crop&w=1920&q=80',
  });

  // Array of 4 high-quality product images
  const heroImages = [
    '/598159305_1186328736969135_3556490608802330705_n.jpg',
    '/599211389_843345045263142_7314016946812866671_n.jpg',
    '/600322421_863886852676225_6953138210890679948_n.jpg',
    '/604437258_879958204720188_4863242959954255480_n.jpg'
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSiteSettings(currentLanguage);
        if (!cancelled && data) {
          setSettings((prev) => ({
            ...prev,
            hero_title: data.hero_title || prev.hero_title,
            hero_subtitle: data.hero_subtitle || prev.hero_subtitle,
            hero_image_url: data.hero_image || data.hero_image_url || prev.hero_image_url,
          }));
        }
      } catch {
        // keep defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  const bgUrl = heroImages[currentImageIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '500px', md: '700px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentImageIndex === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
            },
          }}
        />
      ))}

      {/* Image Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {heroImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: currentImageIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: currentImageIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                transform: 'scale(1.2)',
              },
            }}
          />
        ))}
      </Box>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Fade in={!loading} timeout={1000}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                minHeight: loading ? { xs: '60px', md: '96px' } : 'auto',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {!loading && settings.hero_title}
            </Typography>
          </Fade>
          <Fade in={!loading} timeout={1200}>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                minHeight: loading ? { xs: '52px', md: '72px' } : 'auto',
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {!loading && settings.hero_subtitle}
            </Typography>
          </Fade>
          <Fade in={!loading} timeout={1400}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/products')}
                sx={{
                  backgroundColor: '#D32F2F',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '30px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#B71C1C',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Explore Our Products
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/private-label')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '30px',
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                    borderWidth: 2,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Private Label Solutions
              </Button>
            </Box>
          </Fade>
        </Box>
        
        {/* Quality badges */}
        <Fade in={!loading} timeout={1600}>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center', 
              mt: 6,
              flexWrap: 'wrap',
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                px: 3,
                py: 1.5,
                borderRadius: '25px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>🏆</Typography>
              <Typography sx={{ fontWeight: 600, color: '#212121' }}>
                75+ Years of Excellence
              </Typography>
            </Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                px: 3,
                py: 1.5,
                borderRadius: '25px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>✓</Typography>
              <Typography sx={{ fontWeight: 600, color: '#212121' }}>
                FDA Approved Facility
              </Typography>
            </Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                px: 3,
                py: 1.5,
                borderRadius: '25px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>🌍</Typography>
              <Typography sx={{ fontWeight: 600, color: '#212121' }}>
                Nationwide Distribution
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default HeroSection;