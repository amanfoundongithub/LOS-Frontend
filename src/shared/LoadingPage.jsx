import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { adminTheme } from '../themes/notification_admin.theme';

export const LoadingPage = ({ message = 'Please wait while we prepare your workspace...' }) => {
  return (
    <ThemeProvider theme={adminTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 30%, #f1f5f9 0%, #f8fafc 100%)',
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
              boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.06)',
            }}
          >
            {/* Glowing Spinner Ring */}
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2.5,
                borderRadius: '50%',
                bgcolor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 10px rgba(238, 242, 255, 0.8)',
              }}
            >
              <CircularProgress size={42} thickness={4} color="primary" />
            </Box>

            {/* Title & Custom Message */}
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'grey.900',
                mb: 1,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.35rem', sm: '1.5rem' },
              }}
            >
              Getting Things Ready
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
              }}
            >
              {message}
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};