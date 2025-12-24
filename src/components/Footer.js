import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
  Skeleton,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Public as PublicIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { fetchFooterSettings, fetchFooterLinks } from '../api/content';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [footerSettings, setFooterSettings] = useState({
    office_address_lines: ['123 Food Industry Blvd', 'Suite 400', 'Atlanta, GA 30301', 'USA'],
    about_text: 'Since 1947, Dixie Mills has been crafting premium sauces and condiments for restaurants, retailers, and food service providers. Our commitment to quality and flavor has made us a trusted partner in the food industry.',
    facebook_url: '#',
    instagram_url: '#',
    youtube_url: '#',
    website_url: '#',
    copyright_text: '© {year}, Dixie Mills ┃ ALL RIGHTS RESERVED ┃',
    phone: '+1 (555) 123-4567',
    email: 'info@dixiemills.com',
  });
  const [footerLinks, setFooterLinks] = useState([
    { label: 'Privacy Policy', url: '#' },
    { label: 'Terms of Service', url: '#' },
    { label: 'Shipping Information', url: '#' },
    { label: 'Wholesale Inquiries', url: '#' },
    { label: 'Careers', url: '#' },
  ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [settingsData, linksData] = await Promise.all([
          fetchFooterSettings(currentLanguage),
          fetchFooterLinks(currentLanguage),
        ]);
        
        if (!cancelled) {
          if (settingsData) {
            setFooterSettings({
              office_address_lines: settingsData.office_address_lines || footerSettings.office_address_lines,
              about_text: settingsData.about_text || footerSettings.about_text,
              facebook_url: settingsData.facebook_url || footerSettings.facebook_url,
              instagram_url: settingsData.instagram_url || footerSettings.instagram_url,
              youtube_url: settingsData.youtube_url || footerSettings.youtube_url,
              website_url: settingsData.website_url || footerSettings.website_url,
              copyright_text: settingsData.copyright_text || footerSettings.copyright_text,
              phone: settingsData.phone || footerSettings.phone,
              email: settingsData.email || footerSettings.email,
            });
          }
          if (linksData) {
            setFooterLinks(linksData.filter(link => link.is_active));
          }
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
        // Keep default values on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  const formatCopyright = (text) => {
    return text.replace('{year}', currentYear);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#212121',
        color: 'white',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#FFC107' }}>
              {t('footer.about_dixie_mills', 'About Dixie Mills')}
            </Typography>
            {loading ? (
              <>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
              </>
            ) : (
              <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3 }}>
                {footerSettings.about_text}
              </Typography>
            )}
            
            {/* Certifications */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                px: 2, 
                py: 1, 
                borderRadius: 1,
                fontSize: '0.875rem',
              }}>
                FDA Approved
              </Box>
              <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                px: 2, 
                py: 1, 
                borderRadius: 1,
                fontSize: '0.875rem',
              }}>
                SQF Certified
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#FFC107' }}>
              {t('footer.quick_links', 'Quick Links')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/products" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#FFC107' } }}>
                Our Products
              </Link>
              <Link href="/private-label" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#FFC107' } }}>
                Private Label
              </Link>
              <Link href="/about-us" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#FFC107' } }}>
                About Us
              </Link>
              <Link href="/blog" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#FFC107' } }}>
                Recipes & Tips
              </Link>
              <Link href="/contact-us" sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#FFC107' } }}>
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#FFC107' }}>
              {t('footer.contact_info', 'Contact Information')}
            </Typography>
            {loading ? (
              <>
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={50} />
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 2 }}>
                  {footerSettings.office_address_lines.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < footerSettings.office_address_lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{footerSettings.phone}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <EmailIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{footerSettings.email}</Typography>
                </Box>
              </>
            )}
            
            {/* Social Media */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              {t('footer.follow_us', 'Follow Us')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="circular" width={40} height={40} />
                ))
              ) : (
                <>
                  {footerSettings.facebook_url && (
                    <IconButton
                      component="a"
                      href={footerSettings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: '#1877F2',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <FacebookIcon />
                    </IconButton>
                  )}
                  {footerSettings.instagram_url && (
                    <IconButton
                      component="a"
                      href={footerSettings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: '#E4405F',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                  {footerSettings.youtube_url && (
                    <IconButton
                      component="a"
                      href={footerSettings.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: '#FF0000',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <YouTubeIcon />
                    </IconButton>
                  )}
                  {footerSettings.website_url && (
                    <IconButton
                      component="a"
                      href={footerSettings.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: '#D32F2F',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <PublicIcon />
                    </IconButton>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      {/* Bottom Bar */}
      <Box sx={{ py: 3, backgroundColor: '#1a1a1a' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2">
              {loading ? <Skeleton variant="text" width={300} /> : formatCopyright(footerSettings.copyright_text)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="text" width={100} />
                ))
              ) : (
                footerLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#FFC107',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;