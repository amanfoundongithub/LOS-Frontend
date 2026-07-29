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
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import axios from 'axios';

import { apexLendingTheme } from '../shared/themes/ApexLendingTheme';
import { validateEmail } from '../shared/validators/email.validator';
import { config } from '../shared/config/environment.config';
import { getErrorType } from '../shared/http/error.handler';
import { httpErrorTypes } from '../shared/http/error.types';


const featuresOfPage = [
  { icon: '⚡', title: 'Instant Approvals', desc: 'Get funded in minutes, not weeks' },
  { icon: '🔒', title: 'Secure & Compliant', desc: 'Bank-grade security for your data' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees or surprises' },
]


export default function ApexLendingLogin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(false);

  const themeInstance = useTheme();
  const isMobile = useMediaQuery(themeInstance.breakpoints.down('md'));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoginAttempt(true);

    // Validation - at least one of username or email is required
    if (!username.trim() && !email.trim()) {
      setError('Please enter either a username or email address');
      setLoading(false);
      return;
    }

    // If email is provided, validate its format
    if (email.trim() && validateEmail(email) === false) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Password validation
    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    // API call to IAM Service (TODO: Configure to Gateway)
    const loginUrl = `${config.BACKEND_SERVICE_BASE_URL}${config.LOGIN_URI}`;
    const requestBody = {
      email: email,
      password: password,
      username: username
    };

    axios.post(loginUrl, requestBody)
      .then((res) => {
        const data = res.data;
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.SERVICE_UNAVAILABLE) {
          setError(
            "Unable to connect to the backend service. Please try again."
          );
        } else if (errorType === httpErrorTypes.NOT_FOUND) {
          setError(
            "The user with the given username/email is not found. Try again."
          )
        } else if (errorType === httpErrorTypes.FORBIDDEN) {
          setError(
            "The password for the given username/email is incorrect. Please try again."
          )
        } else if (errorType === httpErrorTypes.RESOURCE_LOCKED) {
          setError(
            "The user is currently locked due to multiple login failures. Please try again after some time."
          )
        } else {
          setError(
            "Unexpected error from server during processing of request. Please try again."
          )
          console.error(err);
        }
      })
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
                Fast Home-Loans for your dream home!
              </Typography>

              <Typography
                sx={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.85)',
                  maxWidth: '400px',
                }}
              >
                Get competitive rates with early approvals and a perfect package for your home!
              </Typography>
            </Box>

            {/* Features */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {featuresOfPage.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: index < 2 ? '24px' : 0,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '24px',
                      minWidth: '32px',
                      textAlign: 'center',
                    }}
                  >
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

        {/* Right Panel - Login Form */}
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
            {/* Mobile Brand (shown only on small screens) */}
            {isMobile && (
              <Box sx={{ marginBottom: '40px', textAlign: 'center' }}>
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
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginBottom: '12px',
                  color: '#0F4C75',
                }}
              >
                Welcome Back
              </Typography>

              <Typography
                sx={{
                  marginBottom: '32px',
                  color: '#8B92A1',
                  fontSize: '0.9rem',
                }}
              >
                Sign in to your Apex Lending account to continue
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    marginBottom: '24px',
                    borderRadius: '8px',
                    border: '1px solid #FFCDD2',
                    '& .MuiAlert-message': {
                      fontSize: '0.9rem',
                    },
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin}>
                {/* Username Field */}
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
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            sx={{
                              color: '#D4AF37',
                              fontSize: '18px',
                              fontWeight: 'bold',
                            }}
                          >
                            @
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* OR Divider */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E4E8' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#8B92A1', fontWeight: 600 }}>
                    OR
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E4E8' }} />
                </Box>

                {/* Email Field */}
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
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{
                              color: '#D4AF37',
                              fontSize: '20px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ marginBottom: '32px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#1A2332',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Password
                    </Typography>
                    <Typography
                      component="a"
                      href="#forgot"
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#D4AF37',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                        '&:hover': {
                          color: '#0F4C75',
                        },
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon
                            sx={{
                              color: '#D4AF37',
                              fontSize: '20px',
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="text"
                            onClick={handleClickShowPassword}
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
                </Box>

                {/* Login Button */}
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
                    'Sign In'
                  )}
                </Button>

                {/* Divider */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E4E8' }} />
                  <Typography sx={{ fontSize: '0.85rem', color: '#8B92A1' }}>
                    OR
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E4E8' }} />
                </Box>

                {/* Sign Up Link */}
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#8B92A1',
                  }}
                >
                  Don't have an account?{' '}
                  <Typography
                    component="a"
                    href="#signup"
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
                    Create one now
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