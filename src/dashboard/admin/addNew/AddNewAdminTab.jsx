import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  Box,
  Button,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShieldIcon from '@mui/icons-material/Shield';
import { CheckCircleOutlined, ErrorOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { AddAdminDialog } from './AddAdminDialog';
import axios from 'axios';
import { config } from '../../../shared/config/environment.config';

const AddNewAdminTab = ({ users, setUsers }) => {
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  // State for Feedback (Success/Error) Dialog
  const [feedback, setFeedback] = useState({
    open: false,
    type: 'success', // 'success' | 'error'
    title: '',
    message: '',
  });

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  const handleAddAdmin = (formData) => {
    setAddAdminLoading(true);
    const payload = {
      email: formData.email.trim(),
      username: formData.username.trim(),
      password: formData.password,
      role: formData.role,
      signingLimit: 100000,
    };

    axios
      .post(
        `${config.BACKEND_SERVICE_BASE_URL}${config.REGISTER_URI}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setAddAdminLoading(false);
        setAddAdminOpen(false);

        // Update local state if users prop exists
        if (setUsers && users) {
          setUsers((prevUsers) => [
            ...prevUsers,
            {
              id: res.data?.id || `user-${Date.now()}`,
              username: payload.username,
              email: payload.email,
              status: 'ACTIVE',
              role: payload.role,
              createdAt: new Date().toISOString().split('T')[0],
            },
          ]);
        }

        // Show Success Dialog
        setFeedback({
          open: true,
          type: 'success',
          title: 'Admin Created Successfully',
          message: `The administrator account for "${payload.username}" has been provisioned. An activation notification has been sent to ${payload.email}.`,
        });
      })
      .catch((err) => {
        console.error('Error creating admin user:', err);
        setAddAdminLoading(false);

        // Extract error message if provided by backend API
        const apiErrorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to create the administrator user. Please check your network connection or server parameters.';

        // Show Error Dialog
        setFeedback({
          open: true,
          type: 'error',
          title: 'Creation Failed',
          message: apiErrorMessage,
        });
      });
  };

  const guideItems = [
    { title: 'Username', desc: 'Unique identifier used for platform login & system logging' },
    { title: 'Email Address', desc: 'Official work email used for security alerts & recovery' },
    { title: 'Role Permission', desc: 'Assign Admin or Super Admin level access' },
    { title: 'Temporary Password', desc: 'Generated password requiring change upon initial login' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tab Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 76, 117, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PersonAddIcon sx={{ color: '#0F4C75', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A2332', fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
            Create A New Admin User
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B92A1', fontSize: '0.85rem' }}>
            Provision elevated access privileges and credentials for new team administrators
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Action Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 10px 30px -10px rgba(10, 53, 87, 0.05)',
            }}
          >
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(15, 76, 117, 0.1) 0%, rgba(26, 107, 157, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                border: '1px solid rgba(15, 76, 117, 0.15)',
              }}
            >
              <PersonAddIcon sx={{ fontSize: 44, color: '#0F4C75' }} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2332', mb: 1 }}>
              Add A New Administrator
            </Typography>

            <Typography variant="body2" sx={{ color: '#8B92A1', mb: 3.5, maxWidth: '340px', lineHeight: 1.6 }}>
              As an administrator, you can grant system management permissions to team members by provisioning an account for them.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => setAddAdminOpen(true)}
              startIcon={<PersonAddIcon />}
              sx={{
                px: 4,
                py: 1.4,
                borderRadius: '12px',
                backgroundColor: '#0F4C75',
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(15, 76, 117, 0.25)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#1A6B9D',
                  boxShadow: '0 10px 24px rgba(26, 107, 157, 0.35)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Create Admin User
            </Button>
          </Card>
        </Grid>

        {/* Right Guide Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 30px -10px rgba(10, 53, 87, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldIcon sx={{ fontSize: 20, color: '#A68625' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2332', fontSize: '1.05rem' }}>
                Admin Creation Requirements
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {guideItems.map((item, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    backgroundColor: '#F4F7FA',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#1A6B9D',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(15, 76, 117, 0.06)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '8px',
                      backgroundColor: '#0F4C75',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1A2332', fontSize: '0.9rem', mb: 0.2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8B92A1', fontSize: '0.825rem', lineHeight: 1.4 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Creation Form Dialog */}
      <AddAdminDialog
        open={addAdminOpen}
        onClose={() => setAddAdminOpen(false)}
        onSave={handleAddAdmin}
        loading={addAdminLoading}
      />

      {/* Feedback Alert Dialog (Success / Error) */}
      <Dialog
        open={feedback.open}
        onClose={handleCloseFeedback}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1,
            textAlign: 'center',
            boxShadow: '0 20px 40px -15px rgba(10, 53, 87, 0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
          <IconButton size="small" onClick={handleCloseFeedback} sx={{ color: '#8B92A1' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ pt: 0, pb: 2, px: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            }}
          >
            {feedback.type === 'success' ? (
              <CheckCircleOutlined sx={{ fontSize: 38, color: '#10B981' }} />
            ) : (
              <ErrorOutlined sx={{ fontSize: 38, color: '#EF4444' }} />
            )}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2332', mb: 1 }}>
            {feedback.title}
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.5 }}>
            {feedback.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            variant="contained"
            onClick={handleCloseFeedback}
            sx={{
              width: '100%',
              borderRadius: '10px',
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: feedback.type === 'success' ? '#0F4C75' : '#EF4444',
              '&:hover': {
                backgroundColor: feedback.type === 'success' ? '#1A6B9D' : '#DC2626',
              },
            }}
          >
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddNewAdminTab;