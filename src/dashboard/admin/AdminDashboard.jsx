import React, { useState, useEffect } from 'react';
import { Box, Container, Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { UnauthorizedEntryPage } from '../../fallback/403UnauthorizedEntryPage';
import { LoadingPage } from '../../shared/LoadingPage';
import { getUserProfile } from '../../shared/session/profile.loader';
import { checkIfIAMAdmin } from '../../shared/session/permission.checker';
import { AppTopBar } from '../AppTopBar';
import { adminTheme } from '../../themes/notification_admin.theme';
import { AppTabs } from '../AppTabs';
import { searchAllUsers } from './http/admin.search-users';
import { AdminUserManagementComponent } from './components/AdminUserManagement';
import { useIsDeviceMobile } from '../../utils/device.util';
import { getUserSummary } from './http/admin.user-summary';
import { AdminStatistics } from './AdminStatisticsTab';
import AddNewAdminTab from './addNew/AddNewAdminTab';
import { getErrorType } from '../../shared/http/error.handler';
import { httpErrorTypes } from '../../shared/http/error.types';
import ServiceUnavailablePage from '../../fallback/503ServiceUnavailable';

// Main Component
export default function IAMAdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Users Management State
  const [users, setUsers] = useState([]);

  // Statistics (to be shared b/w user search tab and statistics, so kept here)
  const [userSummaryStats, setUserSummaryStats] = useState({});

  const isMobile = useIsDeviceMobile();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile();
      const allUsers = await searchAllUsers();
      const userSummary = await getUserSummary();
      setUserSummaryStats(userSummary);
      setUsers(allUsers);
      setUser(userProfile);
      setUnauthorized(!checkIfIAMAdmin(userProfile));
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      const errorType = getErrorType(error);
      if(errorType === httpErrorTypes.SERVICE_UNAVAILABLE) {
        setServiceUnavailable(true);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingPage 
      />
    );
  }

  if(serviceUnavailable) {
    return (
      <ServiceUnavailablePage 
      />
    )
  }

  if (unauthorized) {
    return (
      <UnauthorizedEntryPage
      title = "Access Denied"
      message = "You are trying to enter a high security user management system. Please ensure that you have the desired access."
      />
    );
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
        
        <AppTopBar 
        roleString = "Identity & Access Management Administrator"
        user = {user}
        />

        <Container maxWidth="xl" sx={{ pb: 4, pt: 4, px: isMobile ? 2 : 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider', backgroundColor: '#fff', borderRadius: '12px 12px 0 0' }}>
            <AppTabs 
            listOfTabs={[
              "Statistics",
              "Manage Users",
              "Add Admin"
            ]}
            tabValue = {tabValue}
            setTabValue = {setTabValue}
            />
          </Box>

          {tabValue === 0 && 
            <AdminStatistics 
            stats={userSummaryStats}
            />
          }

          {tabValue === 1 && 
            <AdminUserManagementComponent />
          }

          {tabValue === 2 && (
            <AddNewAdminTab 
            users={users}
            setUsers={setUsers}
            />
          )}
        </Container>

      
      </Box>
    </ThemeProvider>
  );
}