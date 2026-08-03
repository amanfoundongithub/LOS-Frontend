import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Alert,
  Grid
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MailIcon from '@mui/icons-material/Mail';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { getUserProfile } from '../../shared/session/profile.loader';
import { config } from '../../shared/config/environment.config';
import { checkIfNotificationAdmin } from '../../shared/session/permission.checker';


import { adminTheme } from '../../themes/notification_admin.theme';
import { findAllNotificationTemplate } from '../../shared/notification_admin/template.find';
import { useIsDeviceMobile } from '../../utils/device.util';
import { TableOfTemplatesTab } from './tabs/TableOfTemplatesTab';
import { NotificationAdminProfile } from './profile/NotificationAdminProfile';
import { NotificationAdminSearchTab } from './tabs/NotificationAdminSearchTab';
import { AuditLogDialog } from './audit/AuditLogDialog';
import { EmailLookupDialog } from './dialog/EmailLookupDialog';
import { StatisticCard } from './statistics/StatisticsCard';
import { UnauthorizedEntryPage } from '../../shared/UnauthorizedEntryPage';
import { LoadingPage } from '../../shared/LoadingPage';
import { AppTabs } from '../AppTabs';
import { AppTopBar } from '../AppTopBar';


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
      fetchAllEmailTemplates();
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
      title = {"Access Denied"}
      message = "This page is available for only Notification Service Administrators"
      />
    );
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

        <AppTopBar
        roleString = "Notification Service Administrator"
        user = {user}
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
            tabValue = {tabValue}
            setTabValue = {setTabValue}
          />
          
          {tabValue === 0 && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                  📊 Email Notification Dashboard
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: '0.95rem' }}>
                  Monitor and manage your email notification service in real-time
                </Typography>
              </Box>

              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <StatisticCard title="Emails Sent" value={emailStats.sentCount} icon={MailIcon} color="#10B981" subtitle="This month" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatisticCard title="Failed Emails" value={emailStats.failedCount} icon={ErrorIcon} color="#EF4444" subtitle="Requires attention" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatisticCard title="Pending Emails" value={emailStats.pendingCount} icon={WarningIcon} color="#F59E0B" subtitle="In queue" />
                </Grid>
              </Grid>

              <NotificationAdminProfile
              checkPermission = {checkPermission}
              />

              <Card sx={{ p: 3, background: 'linear-gradient(135deg, #0F4C7515 0%, #D4AF3715 100%)' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography color="textSecondary" sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
                        Success Rate
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#10B981', fontWeight: 700 }}>
                        {((emailStats.sentCount / (emailStats.sentCount + emailStats.failedCount)) * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography color="textSecondary" sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
                        Total Processed
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#0F4C75', fontWeight: 700 }}>
                        {(emailStats.sentCount + emailStats.failedCount).toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography color="textSecondary" sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
                        Failure Rate
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#EF4444', fontWeight: 700 }}>
                        {((emailStats.failedCount / (emailStats.sentCount + emailStats.failedCount)) * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography color="textSecondary" sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
                        Queue Backlog
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                        {emailStats.pendingCount}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </>
          )}

          {tabValue === 1 && 
          <TableOfTemplatesTab
          templates = {templates}
          checkPermission = {checkPermission}
          setTemplates = {setTemplates}
          setError = {setError}
          addAuditLog = {addAuditLog}
          />
          }

          {tabValue === 2 && 
          <NotificationAdminSearchTab 
          setEmailLookupOpen = {setEmailLookupOpen}
          />
          }

        </Container>

        <EmailLookupDialog open={emailLookupOpen} onClose={() => setEmailLookupOpen(false)} />

        <AuditLogDialog open={auditDialogOpen} onClose={() => setAuditDialogOpen(false)} logs={auditLogs} />
      </Box>
    </ThemeProvider>
  );
}