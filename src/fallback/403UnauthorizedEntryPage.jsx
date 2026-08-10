import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, Button, Paper, Stack, Chip } from '@mui/material';
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { adminTheme } from '../themes/notification_admin.theme';

export const UnauthorizedEntryPage = ({
  title = 'Access Restricted',
  message = 'You do not have permission to view this page. Please contact your system administrator or log in with a different account.',
  onLogout,
  onGoBack,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 30%, #fffbebe6 0%, #f8fafc 100%)',
          px: 2,
          py: 4,
        }}
      >
        <Container maxWidth="xs" disableGutters sx={{ px: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4.5 },
              borderRadius: 5,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: '0 20px 40px -15px rgba(217, 119, 6, 0.12)',
            }}
          >
            {/* Glowing Icon Container */}
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2.5,
                borderRadius: '50%',
                bgcolor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 10px rgba(254, 243, 199, 0.65)',
              }}
            >
              <LockPersonRoundedIcon sx={{ fontSize: 40, color: '#d97706' }} />
            </Box>

            {/* Status Badge */}
            <Chip
              label="403 • Unauthorized Entry"
              size="small"
              sx={{
                mb: 2,
                fontWeight: 600,
                bgcolor: '#fef3c7',
                color: '#b45309',
                border: '1px solid',
                borderColor: '#fde68a',
              }}
            />

            {/* Dynamic Title */}
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'grey.900',
                mb: 1,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              {title}
            </Typography>

            {/* Dynamic Message */}
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 3.5,
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
              }}
            >
              {message}
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column-reverse', sm: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems="stretch"
              sx={{ width: '100%' }}
            >
              <Button
                variant="outlined"
                color="inherit"
                size="medium"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={handleGoBack}
                fullWidth
                sx={{
                  flex: { sm: 1 },
                  borderRadius: 3,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: 'grey.300',
                  color: 'grey.700',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: 'grey.400',
                    bgcolor: 'grey.50',
                  },
                }}
              >
                Go Back
              </Button>

              <Button
                variant="contained"
                size="medium"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
                disableElevation
                fullWidth
                sx={{
                  flex: { sm: 1 },
                  borderRadius: 3,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  bgcolor: '#d97706',
                  color: '#ffffff',
                  boxShadow: '0 8px 16px -4px rgba(217, 119, 6, 0.3)',
                  '&:hover': {
                    bgcolor: '#b45309',
                    boxShadow: '0 12px 20px -4px rgba(217, 119, 6, 0.4)',
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};