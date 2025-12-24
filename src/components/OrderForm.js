// src/components/OrderForm.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { fetchActiveCategories } from '../api/content';

const OrderForm = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchActiveCategories(currentLanguage);
        setCategories(data || []);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [currentLanguage]);

  const productOptions = {
    sauces: ['Ketchup', 'BBQ Sauce', 'Hot Sauce', 'Sweet & Sour', 'Garlic Sauce'],
    mayonnaise: ['Classic Mayo', 'Light Mayo', 'Garlic Mayo', 'Spicy Mayo'],
    far_east_sauce: ['Soy Sauce', 'Teriyaki', 'Sweet Chili', 'Hoisin Sauce'],
    professional_sauce: ['Bechamel', 'Hollandaise', 'Mushroom Sauce', 'Pepper Sauce'],
    dressings: ['Caesar', 'Ranch', 'Italian', 'French', 'Thousand Island'],
    dixie_kids: ['Kids Ketchup', 'Kids Mayo', 'Kids BBQ'],
    toppings: ['Caramel', 'Chocolate', 'Strawberry', 'Vanilla'],
    condiments: ['Mustard', 'Vinegar', 'Pickles', 'Olives'],
  };

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { category: '', product: '', quantity: 1, id: Date.now() },
    ]);
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const updateProduct = (id, field, value) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = t('order_form.errors.name_required');
    if (!formData.phone) newErrors.phone = t('order_form.errors.phone_required');
    if (!formData.address) newErrors.address = t('order_form.errors.address_required');
    if (selectedProducts.length === 0) {
      newErrors.products = t('order_form.errors.products_required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    
    // Prepare order details
    const orderDetails = {
      customer: formData,
      products: selectedProducts.filter((p) => p.category && p.product),
      timestamp: new Date().toISOString(),
    };

    // Send via WhatsApp
    const message = encodeURIComponent(
      `🛒 *New Order Request*\n\n` +
      `👤 *Customer Details:*\n` +
      `Name: ${formData.name}\n` +
      `${formData.company ? `Company: ${formData.company}\n` : ''}` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email || 'N/A'}\n` +
      `Address: ${formData.address}\n\n` +
      `📦 *Products:*\n` +
      selectedProducts
        .filter((p) => p.category && p.product)
        .map(
          (p) =>
            `• ${p.product} (${p.category}) - Quantity: ${p.quantity}`
        )
        .join('\n') +
      `\n\n${formData.notes ? `📝 *Notes:* ${formData.notes}` : ''}`
    );

    // Replace with your actual WhatsApp number
    const whatsappNumber = '201091678197';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
    setSelectedProducts([]);
    setShowSuccess(true);
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '400px',
          background: 'linear-gradient(135deg, #e91e63 0%, #f44336 100%)',
          transform: 'skewY(-3deg)',
          transformOrigin: 'top left',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
            color: '#ffffff',
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: '3rem', mb: -1, mr: 2 }} />
          {t('order_form.title', 'Request Your Order')}
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 6,
            color: '#ffffff',
            opacity: 0.95,
          }}
        >
          {t('order_form.subtitle', 'Fill out the form below and we\'ll process your order')}
        </Typography>

        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '20px',
            background: '#ffffff',
          }}
        >
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, fontWeight: 600, color: '#2c2976' }}
                  >
                    {t('order_form.customer_info', 'Customer Information')}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('order_form.name', 'Name')}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('order_form.company', 'Company (Optional)')}
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('order_form.phone', 'Phone Number')}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('order_form.email', 'Email (Optional)')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('order_form.address', 'Delivery Address')}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    multiline
                    rows={2}
                    required
                  />
                </Grid>

                {/* Product Selection */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: '#2c2976' }}
                    >
                      {t('order_form.products', 'Products')}
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addProduct}
                      sx={{ ml: 'auto' }}
                      variant="contained"
                      color="primary"
                    >
                      {t('order_form.add_product', 'Add Product')}
                    </Button>
                  </Box>
                  {errors.products && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                      {errors.products}
                    </Typography>
                  )}
                </Grid>

                {selectedProducts.map((product) => (
                  <Grid item xs={12} key={product.id}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        borderRadius: '12px',
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel>
                              {t('order_form.category', 'Category')}
                            </InputLabel>
                            <Select
                              value={product.category}
                              onChange={(e) =>
                                updateProduct(product.id, 'category', e.target.value)
                              }
                              label={t('order_form.category', 'Category')}
                            >
                              {Object.keys(productOptions).map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                  {t(`categories.${cat}`, cat)}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth disabled={!product.category}>
                            <InputLabel>
                              {t('order_form.product', 'Product')}
                            </InputLabel>
                            <Select
                              value={product.product}
                              onChange={(e) =>
                                updateProduct(product.id, 'product', e.target.value)
                              }
                              label={t('order_form.product', 'Product')}
                            >
                              {product.category &&
                                productOptions[product.category].map((prod) => (
                                  <MenuItem key={prod} value={prod}>
                                    {prod}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label={t('order_form.quantity', 'Quantity')}
                            value={product.quantity}
                            onChange={(e) =>
                              updateProduct(
                                product.id,
                                'quantity',
                                parseInt(e.target.value) || 1
                              )
                            }
                            inputProps={{ min: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <IconButton
                            color="error"
                            onClick={() => removeProduct(product.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('order_form.notes', 'Additional Notes (Optional)')}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      startIcon={<LocalShippingIcon />}
                      sx={{
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        background: 'linear-gradient(135deg, #e91e63 0%, #f44336 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #d81b60 0%, #e53935 100%)',
                        },
                      }}
                    >
                      {submitting
                        ? t('order_form.submitting', 'Sending...')
                        : t('order_form.submit', 'Send Order via WhatsApp')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Container>

      {/* Success/Error Messages */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {t('order_form.success', 'Order request sent successfully!')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {t('order_form.error', 'Error sending order. Please try again.')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderForm;