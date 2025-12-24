import React from 'react';
import { Box, Container, Typography, ImageList, ImageListItem, Fade } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const PhotoGallery = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Selected 4 high-quality photos
  const photos = [
    {
      src: '/598159305_1186328736969135_3556490608802330705_n.jpg',
      title: 'Dixie Mills Sauces',
      alt: 'Premium sauces collection'
    },
    {
      src: '/599211389_843345045263142_7314016946812866671_n.jpg',
      title: 'Quality Products',
      alt: 'Factory production line'
    },
    {
      src: '/600322421_863886852676225_6953138210890679948_n.jpg',
      title: 'Our Factory',
      alt: 'Dixie Mills factory'
    },
    {
      src: '/604437258_879958204720188_4863242959954255480_n.jpg',
      title: 'Product Range',
      alt: 'Various sauce products'
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              color: '#2c2976',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            {t('gallery.title', 'Our Production Excellence')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#757575',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            {t('gallery.subtitle', 'Witness our state-of-the-art facilities and premium quality products')}
          </Typography>
        </Box>

        {/* Photo Grid - Desktop */}
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 3,
            height: '800px',
          }}
        >
          {photos.map((photo, index) => (
            <Fade in={true} timeout={800 + index * 200} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
                    '& img': {
                      transform: 'scale(1.1)',
                    },
                    '& .overlay': {
                      opacity: 1,
                    }
                  },
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    color: 'white',
                    p: 3,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {photo.title}
                  </Typography>
                </Box>
              </Box>
            </Fade>
          ))}
        </Box>

        {/* Photo Grid - Mobile */}
        <Box
          sx={{
            display: { xs: 'grid', md: 'none' },
            gridTemplateColumns: '1fr',
            gap: 2,
          }}
        >
          {photos.map((photo, index) => (
            <Fade in={true} timeout={800 + index * 200} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  height: '300px',
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    color: 'white',
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {photo.title}
                  </Typography>
                </Box>
              </Box>
            </Fade>
          ))}
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#757575',
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            {t('gallery.cta', 'Experience the quality that makes Dixie Mills the preferred choice for restaurants and homes across Egypt')}
          </Typography>
        </Box>
      </Container>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e91e63 0%, #f44336 100%)',
          opacity: 0.1,
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
          opacity: 0.1,
          filter: 'blur(40px)',
        }}
      />
    </Box>
  );
};

export default PhotoGallery;