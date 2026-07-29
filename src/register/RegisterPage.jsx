import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
  LinearProgress,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Theme import for Apex Lending
import { apexLendingTheme } from '../shared/themes/ApexLendingTheme';

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
};

const getPasswordStrengthColor = (strength) => {
  if (strength === 0) return '#E0E4E8';
  if (strength === 1) return '#EF4444';
  if (strength === 2) return '#F97316';
  if (strength === 3) return '#EACC00';
  return '#10B981';
};

const getPasswordStrengthLabel = (strength) => {
  if (strength === 0) return 'Password strength';
  if (strength === 1) return 'Weak';
  if (strength === 2) return 'Fair';
  if (strength === 3) return 'Good';
  return 'Strong';
};

export default function ApexLendingSignup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const themeInstance = useTheme();
  const isMobile = useMediaQuery(themeInstance.breakpoints.down('md'));

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSignupSuccess(true);
    }, 1500);
  };

  if (signupSuccess) {
    return (
      <ThemeProvider theme={apexLendingTheme}>
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
          {/* Left Panel - Brand Story */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #0F4C75 0%, #1A6B9D 100%)',
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '48px',
                    gap: '12px',
                  }}
                >
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '24px',
                      color: '#0F4C75',
                      boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    A
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '20px',
                      fontWeight: 700,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Apex Lending
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    marginBottom: '20px',
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  Fast-Track Your Growth
                </Typography>

                <Typography
                  sx={{
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: 'rgba(255, 255, 255, 0.85)',
                    maxWidth: '400px',
                  }}
                >
                  Access competitive lending with transparent rates, instant approvals, and
                  seamless onboarding. Your business deserves better financing solutions.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Success Message Panel */}
          <Box
            sx={{
              flex: isMobile ? 1 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '40px 24px' : '60px 40px',
              backgroundColor: '#F5F7FA',
            }}
          >
            <Container maxWidth="sm">
              <Box
                sx={{
                  backgroundColor: '#FFFFFF',
                  padding: isMobile ? '32px 24px' : '48px',
                  borderRadius: '16px',
                  boxShadow: isMobile
                    ? '0 2px 8px rgba(0, 0, 0, 0.06)'
                    : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  textAlign: 'center',
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: '80px',
                    color: '#10B981',
                    marginBottom: '24px',
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: '12px',
                    color: '#0F4C75',
                  }}
                >
                  Account Created Successfully!
                </Typography>

                <Typography
                  sx={{
                    marginBottom: '32px',
                    color: '#8B92A1',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  Welcome to Apex Lending, {formData.firstName}! Your account has been created and is ready to use.
                  Check your email for confirmation and next steps.
                </Typography>

                <Box sx={{ marginBottom: '20px' }}>
                  <Typography
                    sx={{
                      marginBottom: '16px',
                      color: '#1A2332',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    What happens next?
                  </Typography>
                  {[
                    'Verify your email address',
                    'Complete your business profile',
                    'Submit loan application',
                    'Get instant approval',
                  ].map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        fontSize: '0.9rem',
                        color: '#8B92A1',
                      }}
                    >
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#D4AF37',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0F4C75',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          minWidth: '24px',
                        }}
                      >
                        {index + 1}
                      </Box>
                      {step}
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => {
                    // Navigate to login or dashboard
                    window.location.href = '/login';
                  }}
                  sx={{ height: '48px', marginTop: '32px' }}
                >
                  Go to Login
                </Button>
              </Box>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={apexLendingTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        {/* Left Panel - Brand Story */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #0F4C75 0%, #1A6B9D 100%)',
              padding: '60px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.05)',
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-30%',
                left: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.03)',
                pointerEvents: 'none',
              },
            }}
          >
            {/* Brand Header */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '48px',
                  gap: '12px',
                }}
              >
                <Box
                  sx={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '24px',
                    color: '#0F4C75',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  A
                </Box>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                  }}
                >
                  Apex Lending
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  marginBottom: '20px',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                Fast-Track Your Growth
              </Typography>

              <Typography
                sx={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.85)',
                  maxWidth: '400px',
                  marginBottom: '32px',
                }}
              >
                Access competitive lending with transparent rates, instant approvals, and
                seamless onboarding. Your business deserves better financing solutions.
              </Typography>
            </Box>

            {/* Benefits */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {[
                { icon: '⚡', title: 'Instant Approvals', desc: 'Get funded in minutes, not weeks' },
                { icon: '🔒', title: 'Secure & Compliant', desc: 'Bank-grade security for your data' },
                { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees or surprises' },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: index < 2 ? '24px' : 0,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        marginBottom: '4px',
                        fontSize: '0.95rem',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                      }}
                    >
                      {feature.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Right Panel - Signup Form */}
        <Box
          sx={{
            flex: isMobile ? 1 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '40px 24px' : '60px 40px',
            backgroundColor: '#F5F7FA',
            overflowY: 'auto',
            maxHeight: '100vh',
          }}
        >
          <Container maxWidth="sm">
            {/* Mobile Brand */}
            {isMobile && (
              <Box sx={{ marginBottom: '32px', textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '24px',
                      color: '#0F4C75',
                      boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    A
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0F4C75',
                    }}
                  >
                    Apex Lending
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Form Container */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                padding: isMobile ? '32px 24px' : '48px',
                borderRadius: '16px',
                boxShadow: isMobile
                  ? '0 2px 8px rgba(0, 0, 0, 0.06)'
                  : '0 8px 32px rgba(0, 0, 0, 0.08)',
                marginBottom: isMobile ? '40px' : '0',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginBottom: '12px',
                  color: '#0F4C75',
                }}
              >
                Create Your Account
              </Typography>

              <Typography
                sx={{
                  marginBottom: '32px',
                  color: '#8B92A1',
                  fontSize: '0.9rem',
                }}
              >
                Join thousands of businesses getting funded faster with Apex Lending
              </Typography>

              {/* General Error Alert */}
              {Object.keys(errors).some((key) => key === 'form') && (
                <Alert severity="error" sx={{ marginBottom: '24px', borderRadius: '8px' }}>
                  {errors.form}
                </Alert>
              )}

              <form onSubmit={handleSignup}>
                {/* First Name & Last Name */}
                <Box sx={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: '#1A2332',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      First Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#D4AF37', fontSize: '20px' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: '#1A2332',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Last Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#D4AF37', fontSize: '20px' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ marginBottom: '20px' }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1A2332',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#D4AF37', fontSize: '20px' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Phone */}
                <Box sx={{ marginBottom: '20px' }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1A2332',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#D4AF37', fontSize: '20px' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Company Name */}
                <Box sx={{ marginBottom: '20px' }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1A2332',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Company Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="companyName"
                    placeholder="Your Business Inc."
                    value={formData.companyName}
                    onChange={handleInputChange}
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon sx={{ color: '#D4AF37', fontSize: '20px' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Password */}
                <Box sx={{ marginBottom: '20px' }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1A2332',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#D4AF37', fontSize: '20px' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="text"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{
                              minWidth: 'auto',
                              padding: 0,
                              color: '#8B92A1',
                              '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#0F4C75',
                              },
                            }}
                          >
                            {showPassword ? (
                              <VisibilityOffIcon sx={{ fontSize: '20px' }} />
                            ) : (
                              <VisibilityIcon sx={{ fontSize: '20px' }} />
                            )}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <Box sx={{ marginTop: '12px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#8B92A1',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {getPasswordStrengthLabel(passwordStrength)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength / 4) * 100}
                        sx={{
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: '#E0E4E8',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getPasswordStrengthColor(passwordStrength),
                            borderRadius: '3px',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Confirm Password */}
                <Box sx={{ marginBottom: '24px' }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1A2332',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#D4AF37', fontSize: '20px' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="text"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            sx={{
                              minWidth: 'auto',
                              padding: 0,
                              color: '#8B92A1',
                              '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#0F4C75',
                              },
                            }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon sx={{ fontSize: '20px' }} />
                            ) : (
                              <VisibilityIcon sx={{ fontSize: '20px' }} />
                            )}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Terms & Conditions */}
                <Box sx={{ marginBottom: '32px' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (e.target.checked) {
                            setErrors((prev) => ({ ...prev, terms: '' }));
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.9rem', color: '#8B92A1' }}>
                        I agree to the{' '}
                        <Typography
                          component="a"
                          href="#terms"
                          sx={{
                            color: '#0F4C75',
                            fontWeight: 600,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          Terms and Conditions
                        </Typography>{' '}
                        and{' '}
                        <Typography
                          component="a"
                          href="#privacy"
                          sx={{
                            color: '#0F4C75',
                            fontWeight: 600,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          Privacy Policy
                        </Typography>
                      </Typography>
                    }
                  />
                  {errors.terms && (
                    <Typography sx={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px' }}>
                      {errors.terms}
                    </Typography>
                  )}
                </Box>

                {/* Sign Up Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{
                    height: '48px',
                    marginBottom: '24px',
                    position: 'relative',
                    '&:disabled': {
                      opacity: 0.7,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Login Link */}
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#8B92A1',
                  }}
                >
                  Already have an account?{' '}
                  <Typography
                    component="a"
                    href="#login"
                    sx={{
                      color: '#0F4C75',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: '#D4AF37',
                      },
                    }}
                  >
                    Sign in here
                  </Typography>
                </Typography>
              </form>

              {/* Security Badge */}
              <Box
                sx={{
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid #E0E4E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#8B92A1',
                  fontSize: '0.8rem',
                }}
              >
                <Box sx={{ width: '16px', height: '16px', fontSize: '14px' }}>🔒</Box>
                Your data is encrypted and secure
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}