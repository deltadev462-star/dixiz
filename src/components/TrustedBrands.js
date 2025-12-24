import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Skeleton } from '@mui/material';
import { fetchBrands, fetchSiteSettings } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';

const TrustedBrands = () => {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('Trusted by Leading Restaurants & Retailers');
  const { currentLanguage } = useLanguage();

  // Default food industry partner brands
  const defaultBrands = [
    {
      id: 1,
      name: 'Walmart',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
    },
    {
      id: 2,
      name: 'Kroger',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Kroger_logo_%282019%29.svg',
    },
    {
      id: 3,
      name: 'Whole Foods',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Whole_Foods_Market_201x_logo.svg',
    },
    {
      id: 4,
      name: 'Subway',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg',
    },
    {
      id: 5,
      name: "McDonald's",
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
    },
    {
      id: 6,
      name: 'Burger King',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Burger_King_logo_%281999%29.svg',
    },
    {
      id: 7,
      name: 'Target',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Target_Corporation_logo_%28vector%29.svg',
    },
    {
      id: 8,
      name: 'Costco',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg',
    },
    {
      id: 9,
      name: 'Safeway',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Safeway_Logo.svg',
    },
    {
      id: 10,
      name: 'Publix',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Publix_logo.svg',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rows, settings] = await Promise.all([
          fetchBrands(),
          fetchSiteSettings(currentLanguage)
        ]);
        if (!cancelled) {
          setBrands(rows && rows.length > 0 ? rows : defaultBrands);
          if (settings?.brands_title) {
            setSectionTitle(settings.brands_title);
          }
        }
      } catch {
        if (!cancelled) {
          setBrands(defaultBrands);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  const BrandCard = ({ brand }) => (
    <Box
      sx={{
        width: { xs: '120px', md: '180px' },
        height: { xs: '80px', md: '100px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: 2,
        filter: 'grayscale(100%)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          filter: 'grayscale(0%)',
          transform: 'scale(1.1)',
          boxShadow: '0 6px 20px rgba(211, 47, 47, 0.3)',
          borderColor: '#D32F2F',
          border: '2px solid',
        },
      }}
    >
      <Box
        component="img"
        src={brand.logo_url}
        alt={brand.name}
        sx={{
          maxWidth: '90%',
          maxHeight: '90%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
        }}
        onError={(e) => {
          if (brand.fallback_logo_url && e.target.src !== brand.fallback_logo_url) {
            e.target.src = brand.fallback_logo_url;
          } else {
            e.target.style.display = 'none';
            const sibling = e.target.nextSibling;
            if (sibling) sibling.style.display = 'block';
          }
        }}
      />
      <Typography
        variant="h6"
        sx={{
          display: 'none',
          fontWeight: 600,
          color: '#666',
          fontSize: { xs: '0.875rem', md: '1.125rem' },
          textAlign: 'center',
        }}
      >
        {brand.name}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ py: 8, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              color: '#212121',
              mb: 2,
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
            }}
          >
            Our products are featured in major retail chains and restaurants across the nation
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            alignItems: 'center',
          }}
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <Box
                  key={`s-${i}`}
                  sx={{
                    width: { xs: '120px', md: '180px' },
                    height: { xs: '80px', md: '100px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </Box>
              ))
            : brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)}
        </Box>
        
        {/* Trust Indicators */}
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#D32F2F' }}>
              500+
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              Restaurant Partners
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#D32F2F' }}>
              1000+
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              Retail Locations
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#D32F2F' }}>
              50M+
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              Products Sold Annually
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TrustedBrands;