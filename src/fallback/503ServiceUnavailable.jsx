import React from 'react';
import { Container, Box, Typography, Button, Paper, Stack, Chip } from '@mui/material';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const ServiceUnavailablePage = ({
  onRetry = () => window.location.reload(),
  onGoHome = () => (window.location.href = '/'),
  estimatedTime = '10–15 minutes',
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, #fef2f2 0%, #f8fafc 100%)',
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
            boxShadow: '0 20px 40px -15px rgba(225, 29, 72, 0.08)',
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
              bgcolor: 'error.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 10px rgba(254, 226, 226, 0.5)',
            }}
          >
            <CloudOffRoundedIcon sx={{ fontSize: 40, color: 'error.main' }} />
          </Box>

          {/* Status Badge */}
          <Chip
            label="503 • System Maintenance"
            size="small"
            sx={{
              mb: 2,
              fontWeight: 600,
              bgcolor: 'error.50',
              color: 'error.main',
              border: '1px solid',
              borderColor: 'error.100',
            }}
          />

          {/* Core Message */}
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
            Taking a Quick Breather
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2.5,
              lineHeight: 1.6,
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
            }}
          >
            Our servers are getting a brief tune-up to keep things running smoothly. We’ll be right back online shortly!
          </Typography>

          {/* Time Estimate Pill */}
          {estimatedTime && (
            <Box
              sx={{
                py: 0.75,
                px: 2,
                mb: 3.5,
                borderRadius: 50,
                bgcolor: 'grey.100',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: 'grey.700', fontWeight: 500 }}>
                ⏱️ Back in roughly <strong>{estimatedTime}</strong>
              </Typography>
            </Box>
          )}

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
              startIcon={<HomeRoundedIcon />}
              onClick={onGoHome}
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
              Back Home
            </Button>

            <Button
              variant="contained"
              color="error"
              size="medium"
              startIcon={<RefreshRoundedIcon />}
              onClick={onRetry}
              disableElevation
              fullWidth
              sx={{
                flex: { sm: 1 },
                borderRadius: 3,
                py: 1.2,
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 16px -4px rgba(225, 29, 72, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 20px -4px rgba(225, 29, 72, 0.35)',
                },
              }}
            >
              Try Refreshing
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ServiceUnavailablePage;