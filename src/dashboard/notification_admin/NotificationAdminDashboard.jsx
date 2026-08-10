import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Alert,
  Grid,
  Stack,
  Chip,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MailIcon from '@mui/icons-material/Mail';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import { getUserProfile } from '../../shared/session/profile.loader';
import { config } from '../../shared/config/environment.config';
import { checkIfNotificationAdmin } from '../../shared/session/permission.checker';
import QueueIcon from '@mui/icons-material/Queue';

import { adminTheme } from '../../themes/notification_admin.theme';
import { findAllNotificationTemplate } from '../../shared/notification_admin/template.find';
import { useIsDeviceMobile } from '../../utils/device.util';
import { TableOfTemplatesTab } from './tabs/TableOfTemplatesTab';
import { NotificationAdminProfile } from './profile/NotificationAdminProfile';
import { NotificationAdminSearchTab } from './tabs/NotificationAdminSearchTab';
import { AuditLogDialog } from './audit/AuditLogDialog';
import { EmailLookupDialog } from './dialog/EmailLookupDialog';
import { UnauthorizedEntryPage } from '../../fallback/403UnauthorizedEntryPage';
import { LoadingPage } from '../../shared/LoadingPage';
import { AppTabs } from '../AppTabs';
import { AppTopBar } from '../AppTopBar';
import { fetchStats } from '../../shared/notification_admin/stats.fetch';
import ColoredStatCard from '../../components/ColoredStatCard';
import { CheckCircleOutlined, TrendingUp } from '@mui/icons-material';


export default function NotificationAdminDashboard() {
  const [tabValue, setTabValue] = useState(0);


  // Email Lookup State
  const [emailLookupOpen, setEmailLookupOpen] = useState(false);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);

  // Email Stats
  const [emailStats, setEmailStats] = useState({ sentCount: 24850, failedCount: 342, pendingCount: 156 });

  const isMobile = useIsDeviceMobile();

  // State variables for controlling the page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);

  // User profile manager
  const [user, setUser] = useState(null);

  // Template listing states
  const [templates, setTemplates] = useState([]);


  /**
   * Utility to fetch user data and sync with the current 
   * process of loading the page. 
   * 
   * This fetches the user's data and syncs it in the profile metadata. 
   */
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile();
      setUser(userProfile);
      setError('');
      addAuditLog('Fetched User Data', `${config.USER_DETAILS_URI}`, 'Success');
      setUnauthorized(!checkIfNotificationAdmin(userProfile));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data');
      addAuditLog('Fetched User Data', `${config.USER_DETAILS_URI}`, 'Failure');
      setLoading(false);
    }
  };
  const fetchAllEmailTemplates = async () => {
    try {
      const allEmailTemplates = await findAllNotificationTemplate();
      setTemplates(allEmailTemplates);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data');
      addAuditLog('Fetched User Data', `${config.USER_DETAILS_URI}`, 'Failure');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData().then(() => {
      fetchAllEmailTemplates().then(() => {
        fetchStats().then((res) => setEmailStats(res));
      })
    })
  }, []);

  /**
   * Utilities to audit the responses and requests.
   * These utilities are required
   */
  const addAuditLog = (action, endpoint, status) => {
    setAuditLogs((prev) => [{ timestamp: new Date(), action, endpoint, status }, ...prev.slice(0, 49)]);
  };

  const checkPermission = (permission) => {
    if (!user?.attributes) return false;
    const permissions = user.attributes;
    return Object.keys(permissions).includes(permission);
  };

  if (loading) {
    return (
      <LoadingPage />
    );
  }

  if (unauthorized) {
    return (
      <UnauthorizedEntryPage
        title={"Access Denied"}
        message="This page is available for only Notification Service Administrators"
      />
    );
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

        <AppTopBar
          roleString="Notification Service Administrator"
          user={user}
        />

        <Container maxWidth="lg" sx={{ pb: 4, pt: 4, px: isMobile ? 2 : 3 }}>
          {error
            &&
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          }

          <AppTabs
            listOfTabs={[
              "Dashboard",
              "Email Templates",
              "Search"
            ]}
            tabValue={tabValue}
            setTabValue={setTabValue}
          />

          {tabValue === 0 && (
            <>
           <Box sx={{ width: '100%', mb: 4 }}>
  {/* Header & Status Section */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      gap: 2,
      mb: 3.5,
      pb: 3,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Icon Badge Container */}
      <Box
        sx={{
          width: { xs: 44, sm: 48 },
          height: { xs: 44, sm: 48 },
          borderRadius: 3,
          bgcolor: 'primary.50',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'primary.100',
          flexShrink: 0,
        }}
      >
        <MarkEmailReadRoundedIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
      </Box>

      {/* Header Text */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" sx={{ mb: 0.5 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Notification Statistics at a Glance
          </Typography>

          <Chip
            label="Live"
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 700,
              bgcolor: 'success.50',
              color: 'success.dark',
              border: '1px solid',
              borderColor: 'success.200',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            fontWeight: 400,
          }}
        >
          Track real-time delivery performance to assess the health of your notification service.
        </Typography>
      </Box>
    </Box>
  </Box>

  {/* 1. Primary Stat Cards */}
  <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ mb: 3 }}>
    <Grid item xs={12} sm={6} md={4}>
      <ColoredStatCard
        title="Emails Sent"
        value={emailStats.totalSent}
        icon={MailIcon}
        color="#10B981"
        subtitle="Successfully delivered"
      />
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ColoredStatCard
        title="Emails Failed"
        value={emailStats.totalFailed}
        icon={ErrorIcon}
        color="#EF4444"
        subtitle="Failed to deliver"
      />
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ColoredStatCard
        title="Emails Pending"
        value={emailStats.pendingCount}
        icon={WarningIcon}
        color="#F59E0B"
        subtitle="Pending delivery"
      />
    </Grid>
  </Grid>

  {/* 2. Telemetry Summary Strip */}
  <Card
    elevation={0}
    sx={{
      p: { xs: 2.5, sm: 3 },
      mb: 3.5,
      borderRadius: 4,
      background: 'linear-gradient(135deg, rgba(15, 76, 117, 0.04) 0%, rgba(212, 175, 55, 0.04) 100%)',
      border: '1px solid',
      borderColor: 'grey.200',
      boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.03)',
    }}
  >
    <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
      {/* Metric 1: Success Rate */}
      <Grid item xs={6} md={3}>
        <Box sx={{ pr: { md: 2 } }}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
            <CheckCircleOutlined sx={{ fontSize: 16, color: '#10B981' }} />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Success Rate
            </Typography>
          </Stack>
          <Typography
            variant="h4"
            sx={{ color: '#10B981', fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em' }}
          >
            {emailStats.successPercentage}%
          </Typography>
        </Box>
      </Grid>

      {/* Metric 2: Total Processed */}
      <Grid item xs={6} md={3}>
        <Box sx={{ px: { md: 2 }, borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' } }}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
            <TrendingUp sx={{ fontSize: 16, color: '#0F4C75' }} />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Total Processed
            </Typography>
          </Stack>
          <Typography
            variant="h4"
            sx={{ color: '#0F4C75', fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em' }}
          >
            {emailStats.totalProcessed}
          </Typography>
        </Box>
      </Grid>

      {/* Metric 3: Failure Rate */}
      <Grid item xs={6} md={3}>
        <Box sx={{ px: { md: 2 }, borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' } }}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
            <ErrorIcon sx={{ fontSize: 16, color: '#EF4444' }} />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Failure Rate
            </Typography>
          </Stack>
          <Typography
            variant="h4"
            sx={{ color: '#EF4444', fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em' }}
          >
            {emailStats.failurePercentage}%
          </Typography>
        </Box>
      </Grid>

      {/* Metric 4: Queue Backlog */}
      <Grid item xs={6} md={3}>
        <Box sx={{ pl: { md: 2 }, borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' } }}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
            <QueueIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Queue Backlog
            </Typography>
          </Stack>
          <Typography
            variant="h4"
            sx={{ color: '#F59E0B', fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em' }}
          >
            {emailStats.queueBacklog}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Card>

  {/* 3. Admin Profile & Permissions (Moved to the bottom) */}
  <NotificationAdminProfile checkPermission={checkPermission} />
</Box>
            </>
          )}

          {tabValue === 1 &&
            <TableOfTemplatesTab
              templates={templates}
              checkPermission={checkPermission}
              setTemplates={setTemplates}
              setError={setError}
              addAuditLog={addAuditLog}
            />
          }

          {tabValue === 2 &&
            <NotificationAdminSearchTab
              setEmailLookupOpen={setEmailLookupOpen}
            />
          }

        </Container>

        <EmailLookupDialog open={emailLookupOpen} onClose={() => setEmailLookupOpen(false)} />

        <AuditLogDialog open={auditDialogOpen} onClose={() => setAuditDialogOpen(false)} logs={auditLogs} />
      </Box>
    </ThemeProvider>
  );
}