
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FactoryIcon from '@mui/icons-material/Factory';
import ScienceIcon from '@mui/icons-material/Science';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HandshakeIcon from '@mui/icons-material/Handshake';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivateLabel = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <ScienceIcon sx={{ fontSize: 48 }} />,
      title: 'Custom Formulation',
      description: 'Work with our food scientists to create unique flavors tailored to your brand',
    },
    {
      icon: <FactoryIcon sx={{ fontSize: 48 }} />,
      title: 'Manufacturing',
      description: 'State-of-the-art facilities with strict quality control and food safety standards',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 48 }} />,
      title: 'Packaging & Distribution',
      description: 'Custom packaging design and nationwide distribution capabilities',
    },
    {
      icon: <HandshakeIcon sx={{ fontSize: 48 }} />,
      title: 'Partnership Support',
      description: 'Dedicated account management and marketing support for your products',
    },
  ];

  const capabilities = [
    'Sauces & Condiments',
    'Salad Dressings',
    'Marinades & BBQ Sauces',
    'Specialty Ketchups',
    'Mayonnaise & Aioli',
    'Hot Sauces',
    'Custom Blends',
    'Organic Options',
  ];

  const benefits = [
    'No minimum order requirements for initial development',
    'Competitive pricing with volume discounts',
    'Fast turnaround times',
    'FDA-approved facility',
    'SQF certified production',
    'Complete confidentiality',
    'Recipe ownership options',
    'Marketing support available',
  ];

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
            <Typography color="text.primary">Private Label</Typography>
          </Breadcrumbs>

          {/* Hero Section */}
          <Box
            sx={{
              backgroundColor: '#D32F2F',
              color: 'white',
              borderRadius: '16px',
              p: 6,
              mb: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
              Private Label Solutions
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
              Partner with Dixie Mills to create your own branded line of premium sauces and condiments
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact-us')}
              sx={{
                backgroundColor: 'white',
                color: '#D32F2F',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#F5F5F5',
                },
              }}
            >
              Start Your Project
            </Button>
          </Box>

          {/* Services Grid */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
              Full-Service Private Label Manufacturing
            </Typography>
            <Grid container spacing={4}>
              {services.map((service, index) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box sx={{ color: '#D32F2F', mb: 2 }}>{service.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Capabilities Section */}
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Product Capabilities
                </Typography>
                <Grid container spacing={2}>
                  {capabilities.map((capability, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                        <Typography>{capability}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Why Choose Dixie Mills?
                </Typography>
                <List>
                  {benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Process Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
              Our Simple Process
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: '#FFF3E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#E65100',
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Consultation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discuss your vision, target market, and requirements
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: '#E8F5E9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#2E7D32',
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Development
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create custom formulations and packaging designs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: '#E3F2FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#1976D2',
                    }}
                  >
                    3
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Production
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manufacture your products with quality assurance
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: '#F3E5F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#7B1FA2',
                    }}
                  >
                    4
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Delivery
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ship products to your warehouse or directly to customers
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Success Stories */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
              Success Stories
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, height: '100%', backgroundColor: '#FFEBEE' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Regional Restaurant Chain
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    "Dixie Mills helped us create a signature BBQ sauce that's now our best-selling retail product. Their expertise and support made the process seamless."
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#D32F2F' }}>
                    - 50,000 units sold in first year
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, height: '100%', backgroundColor: '#E8F5E9' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Gourmet Food Store
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    "We launched our own line of artisanal mayonnaise with unique flavors. The quality exceeded our expectations and our customers love it!"
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                    - 5 SKUs launched successfully
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, height: '100%', backgroundColor: '#FFF3E0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Online Food Brand
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    "From concept to shelf in just 3 months. Dixie Mills made our dream of having our own hot sauce brand a reality."
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#E65100' }}>
                    - Now in 500+ stores nationwide
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box
            sx={{
              backgroundColor: '#E3F2FD',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              mb: 8,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Ready to Create Your Own Brand?
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575', mb: 4, maxWidth: '600px', mx: 'auto' }}>
              Let's discuss how we can help bring your vision to life. Our team is ready to guide you through every step of the process.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact-us')}
                sx={{
                  backgroundColor: '#1976D2',
                  '&:hover': {
                    backgroundColor: '#1565C0',
                  },
                }}
              >
                Request a Quote
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#1976D2',
                  color: '#1976D2',
                  '&:hover': {
                    borderColor: '#1565C0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                Download Capabilities Guide
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PrivateLabel;