import React, { useState, useEffect } from 'react';
import { Box, Container, Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { getUserProfile } from '../../shared/session/profile.loader';
import { config } from '../../shared/config/environment.config';
import { checkIfNotificationAdmin } from '../../shared/session/permission.checker';

import { adminTheme } from '../../themes/notification_admin.theme';
import { useIsDeviceMobile } from '../../utils/device.util';
import { TableOfTemplatesTab } from './tableOfTemplatesTab/TableOfTemplatesTab';
import { NotificationAdminSearchTab } from './tabs/NotificationAdminSearchTab';
import { AuditLogDialog } from './audit/AuditLogDialog';
import { EmailLookupDialog } from './dialog/EmailLookupDialog';
import { UnauthorizedEntryPage } from '../../fallback/403UnauthorizedEntryPage';
import { LoadingPage } from '../../shared/LoadingPage';
import { AppTabs } from '../AppTabs';
import { AppTopBar } from '../AppTopBar';
import NotificationAdminStatisticsTab from './statisticsTab/NotificationAdminStatisticsTab';


export default function NotificationAdminDashboard() {
  const [tabValue, setTabValue] = useState(0);


  // Email Lookup State
  const [emailLookupOpen, setEmailLookupOpen] = useState(false);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);

  const isMobile = useIsDeviceMobile();

  // State variables for controlling the page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);

  // User profile manager
  const [user, setUser] = useState(null);



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
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data');
      addAuditLog('Fetched User Data', `${config.USER_DETAILS_URI}`, 'Failure');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  /**
   * Utilities to audit the responses and requests.
   * These utilities are required
   */
  const addAuditLog = (action, endpoint, status) => {
    setAuditLogs((prev) => [{ timestamp: new Date(), action, endpoint, status }, ...prev.slice(0, 49)]);
  };

  if (loading) {
    return (
      <LoadingPage />
    );
  }

  if (unauthorized) {
    return (
      <UnauthorizedEntryPage
        title="Access Denied"
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
              "Statistics",
              "Email Templates",
              "Search"
            ]}
            tabValue={tabValue}
            setTabValue={setTabValue}
          />

          {tabValue === 0 && 
          <NotificationAdminStatisticsTab 
            user = {user}
          />}

          {tabValue === 1 &&
          <TableOfTemplatesTab
            user = {user}
            setError={setError}
            addAuditLog={addAuditLog}
          />}

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