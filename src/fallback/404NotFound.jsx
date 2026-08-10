import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, Stack, Chip } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, #eff6ff 0%, #f8fafc 100%)',
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
            boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.08)',
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
              bgcolor: 'primary.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 10px rgba(219, 234, 254, 0.6)',
            }}
          >
            <SearchOffRoundedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>

          {/* Status Badge */}
          <Chip
            label="404 • Page Not Found"
            size="small"
            sx={{
              mb: 2,
              fontWeight: 600,
              bgcolor: 'primary.50',
              color: 'primary.main',
              border: '1px solid',
              borderColor: 'primary.100',
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
            Looks Like You're Lost
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 3.5,
              lineHeight: 1.6,
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
            }}
          >
            The page you are looking for doesn't exist, was moved, or had its URL mistyped.
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
              onClick={() => navigate(-1)}
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
              color="primary"
              size="medium"
              startIcon={<HomeRoundedIcon />}
              onClick={() => navigate('/login')}
              disableElevation
              fullWidth
              sx={{
                flex: { sm: 1 },
                borderRadius: 3,
                py: 1.2,
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 20px -4px rgba(37, 99, 235, 0.35)',
                },
              }}
            >
              Back Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;