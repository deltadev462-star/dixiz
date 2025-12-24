
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Typography,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Language as LanguageIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { fetchHeaderNavItems, fetchSiteSettings, fetchActiveLanguages } from '../api/content';
import { useLoading } from '../contexts/LoadingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [navItems, setNavItems] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const { startLoading, stopLoading } = useLoading();
  const { currentLanguage, changeLanguage, availableLanguages, setAvailableLanguages, getCurrentLanguageData } = useLanguage();
  const { t } = useTranslation();
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadHeaderData = async () => {
      startLoading('header');
      try {
        const [navData, settingsData, languagesData] = await Promise.all([
          fetchHeaderNavItems(currentLanguage),
          fetchSiteSettings(currentLanguage),
          fetchActiveLanguages(),
        ]);
        
        if (!cancelled) {
          if (languagesData && languagesData.length > 0) {
            setAvailableLanguages(languagesData);
          }
          
          if (navData && navData.length > 0) {
            setNavItems(navData);
          } else {
            setNavItems([
              { id: 1, name: 'Home', route: '/' },
              { id: 2, name: 'Products', route: '#' },
              { id: 3, name: 'Private Label', route: '/private-label' },
              { id: 4, name: 'Services', route: '/services' },
              { id: 5, name: 'About Us', route: '/about-us' },
              { id: 6, name: 'Blog', route: '/blog' },
              { id: 7, name: 'Contact', route: '/contact-us' },
            ]);
          }
          
          if (settingsData) {
            setSiteSettings({
              phone: settingsData.phone || '+1 (555) 123-4567',
              contact_email: settingsData.contact_email || 'info@dixiemills.com',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
        if (!cancelled) {
          setNavItems([
            { id: 1, name: 'Home', route: '/' },
            { id: 2, name: 'Products', route: '#' },
            { id: 3, name: 'Private Label', route: '/private-label' },
            { id: 4, name: 'Services', route: '/services' },
            { id: 5, name: 'About Us', route: '/about-us' },
            { id: 6, name: 'Blog', route: '/blog' },
            { id: 7, name: 'Contact', route: '/contact-us' },
          ]);
        }
      } finally {
        if (!cancelled) {
          stopLoading('header');
        }
      }
    };
    
    loadHeaderData();
    
    return () => {
      cancelled = true;
      stopLoading('header');
    };
  }, [currentLanguage]);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    handleLanguageClose();
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length === 0 && location.pathname === '/search') {
      navigate('/');
      return;
    }

    if (value.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      }, 500);
    }
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleNavClick = (route) => {
    if (route && route !== '#') {
      if (route.startsWith('http://') || route.startsWith('https://')) {
        window.open(route, '_blank');
      } else {
        navigate(route);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <Box sx={{ backgroundColor: '#FFF3E0', py: 1 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('contact.call_us', 'Call us')}: {siteSettings.phone}
              </Typography>
            </Box>
            
            <Box sx={{
              textAlign: 'center',
              flex: 2,
            }}>
              <Typography variant="body2" sx={{ color: '#D32F2F', fontWeight: 600 }}>
                🚚 {t('header.free_shipping', 'Free shipping on orders over $50')}
              </Typography>
            </Box>
            
            <Box sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <IconButton size="small" onClick={handleLanguageClick}>
                <LanguageIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {getCurrentLanguageData()?.native_name || 'English'}
                </Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleLanguageClose}
              >
                {availableLanguages.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    selected={lang.code === currentLanguage}
                  >
                    {lang.native_name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Navigation */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 2 }}>
            {!isMobile ? (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                {/* Logo */}
                <Box 
                  onClick={() => navigate('/')}
                  sx={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#D32F2F',
                      fontWeight: 700,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    DIXIE
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#212121',
                      fontWeight: 300,
                    }}
                  >
                    MILLS
                  </Typography>
                </Box>

                {/* Navigation Items */}
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {navItems.map((item) => (
                    <Typography
                      key={item.id}
                      onClick={() => handleNavClick(item.route)}
                      sx={{
                        color: '#212121',
                        cursor: item.route && item.route !== '#' ? 'pointer' : 'default',
                        fontSize: '1rem',
                        fontWeight: 500,
                        position: 'relative',
                        '&:hover': {
                          color: '#D32F2F',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: 0,
                          width: 0,
                          height: 2,
                          backgroundColor: '#D32F2F',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      {item.name}
                    </Typography>
                  ))}
                </Box>

                {/* Right Side Actions */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder={t('search.placeholder', 'Search products...')}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    sx={{
                      width: '200px',
                      '& .MuiOutlinedInput-root': {
                        height: '36px',
                        backgroundColor: '#F5F5F5',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: '#D32F2F',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#D32F2F',
                          borderWidth: '1px',
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleSearchSubmit}
                            size="small"
                            sx={{
                              p: 0.5,
                              color: '#757575',
                              '&:hover': {
                                color: '#D32F2F',
                              },
                            }}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <IconButton
                    sx={{
                      color: '#212121',
                      '&:hover': {
                        color: '#D32F2F',
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <>
                {/* Mobile Layout */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Box 
                    onClick={() => navigate('/')}
                    sx={{ 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#D32F2F',
                        fontWeight: 700,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      DIXIE
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#212121',
                        fontWeight: 300,
                      }}
                    >
                      MILLS
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton sx={{ color: '#212121' }}>
                      <ShoppingCartIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: '#212121' }}
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Mobile Search */}
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t('search.placeholder', 'Search products...')}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '36px',
                        backgroundColor: '#F5F5F5',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: '#D32F2F',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#D32F2F',
                          borderWidth: '1px',
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleSearchSubmit}
                            size="small"
                            sx={{
                              p: 0.5,
                              color: '#757575',
                              '&:hover': {
                                color: '#D32F2F',
                              },
                            }}
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  button
                  onClick={() => handleNavClick(item.route)}
                  disabled={!item.route || item.route === '#'}
                  sx={{
                    '&:hover': {
                      backgroundColor: item.route && item.route !== '#' ? '#FFF3E0' : 'transparent',
                      color: item.route && item.route !== '#' ? '#D32F2F' : 'inherit',
                    },
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;