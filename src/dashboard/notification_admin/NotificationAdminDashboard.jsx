import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MailIcon from '@mui/icons-material/Mail';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import SearchIcon from '@mui/icons-material/Search';
import { getUserProfile } from '../../shared/session/profile.loader';
import { config } from '../../shared/config/environment.config';
import { checkIfNotificationAdmin } from '../../shared/session/permission.checker';
import { createNotificationTemplate } from '../../shared/notification_admin/template.create';
import { updateNotificationTemplate } from '../../shared/notification_admin/template.update';
import { TemplateCreateDialog } from './dialog/TemplateCreateDialog';
import { TemplateUpdateDialog } from './dialog/TemplateUpdateDialog';

import { 
  NOTIFICATION_TEMPLATE_CREATE_PERMISSION,
  NOTIFICATION_TEMPLATE_UPDATE_PERMISSION,
} from '../../constants/notification_admin.permissions';

import { TemplateViewDialog } from './dialog/TemplateViewDialog';
import { notificationAdminTheme } from '../../themes/notification_admin.theme';
import { findAllNotificationTemplate } from '../../shared/notification_admin/template.find';
import { useIsDeviceMobile } from '../../utils/device.util';
import { TableOfTemplatesTab } from './tabs/TableOfTemplatesTab';
import { NotificationAdminBar } from './bar/NotificationAdminBar';
import { NotificationAdminTabs } from './bar/NotificationAdminTabs';
import { NotificationAdminProfile } from './profile/NotificationAdminProfile';
import { NotificationAdminSearchTab } from './tabs/NotificationAdminSearchTab';
import { AuditLogDialog } from './dialog/AuditLogDialog';

// Statistic Card Component
const StatisticCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)` }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color, fontWeight: 700, mb: 0.5 }}>
            {value.toLocaleString()}
          </Typography>
          {subtitle && <Typography sx={{ fontSize: '0.8rem', color: 'textSecondary', mt: 1 }}>{subtitle}</Typography>}
        </Box>
        <Box sx={{ width: 60, height: 60, borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon sx={{ fontSize: 32, color }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Email Lookup Dialog
const EmailLookupDialog = ({ open, onClose, onSearch, loading = false }) => {
  const [searchType, setSearchType] = useState('trackingId');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    // Simulate API call
    const mockResults = {
      trackingId: [
        {
          id: 'track-001',
          trackingId: searchValue,
          recipientEmail: 'john@example.com',
          templateCode: 'welcome_email',
          status: 'delivered',
          sentAt: new Date().toISOString(),
        },
      ],
      email: [
        {
          id: 'email-001',
          recipientEmail: searchValue,
          templateCode: 'notification_1',
          status: 'sent',
          sentAt: new Date().toISOString(),
        },
        {
          id: 'email-002',
          recipientEmail: searchValue,
          templateCode: 'weekly_digest',
          status: 'failed',
          sentAt: new Date().toISOString(),
        },
      ],
      templateCode: [
        {
          id: 'tmpl-001',
          templateCode: searchValue,
          name: 'Welcome Email',
          createdAt: new Date().toISOString(),
          usageCount: 1523,
        },
      ],
    };

    setResults(mockResults[searchType] || []);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Search Emails & Templates</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Search By
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {[
              { value: 'trackingId', label: 'Tracking ID' },
              { value: 'email', label: 'Email Recipient' },
              { value: 'templateCode', label: 'Template Code' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={searchType === option.value ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setSearchType(option.value);
                  setSearchValue('');
                  setResults([]);
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </FormControl>

        <TextField
          fullWidth
          placeholder={
            searchType === 'trackingId'
              ? 'Enter tracking ID (e.g., TRACK-123456)'
              : searchType === 'email'
                ? 'Enter email address'
                : 'Enter template code'
          }
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} disabled={loading}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {results.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Search Results ({results.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                    {searchType === 'trackingId' && (
                      <>
                        <TableCell>Tracking ID</TableCell>
                        <TableCell>Recipient Email</TableCell>
                        <TableCell>Template</TableCell>
                        <TableCell>Status</TableCell>
                      </>
                    )}
                    {searchType === 'email' && (
                      <>
                        <TableCell>Email</TableCell>
                        <TableCell>Template</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Sent At</TableCell>
                      </>
                    )}
                    {searchType === 'templateCode' && (
                      <>
                        <TableCell>Template Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Usage Count</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      {searchType === 'trackingId' && (
                        <>
                          <TableCell>{result.trackingId}</TableCell>
                          <TableCell>{result.recipientEmail}</TableCell>
                          <TableCell>{result.templateCode}</TableCell>
                          <TableCell>
                            <Chip
                              label={result.status}
                              size="small"
                              color={result.status === 'delivered' ? 'success' : 'default'}
                            />
                          </TableCell>
                        </>
                      )}
                      {searchType === 'email' && (
                        <>
                          <TableCell>{result.recipientEmail}</TableCell>
                          <TableCell>{result.templateCode}</TableCell>
                          <TableCell>
                            <Chip
                              label={result.status}
                              size="small"
                              color={result.status === 'sent' ? 'success' : result.status === 'failed' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>{new Date(result.sentAt).toLocaleDateString()}</TableCell>
                        </>
                      )}
                      {searchType === 'templateCode' && (
                        <>
                          <TableCell>{result.templateCode}</TableCell>
                          <TableCell>{result.name}</TableCell>
                          <TableCell>{result.usageCount}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {!results.length && searchValue && (
          <Alert severity="info">No results found for your search</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const listOfTabs = [
  "Dashboard",
  "Email Templates",
  "Search"
];



export default function NotificationAdminDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const [editingTemplate, setEditingTemplate] = useState(null);

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

  // Template controllers for modifying templates
  const [templateCreate, setTemplateCreate] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(-1);
  const [templateToView, setTemplateToView] = useState(-1);

  // Template controller utility function
  const openCreateTemplateModal = () => {
    setEditingTemplate(null);
    setTemplateCreate(true);
  };
  const openViewTemplateModal = (index) => {
    setTemplateToView(index);
  };
  const openUpdateTemplateModal = (index) => {
    setEditingTemplate(templates[index]);
    setTemplateToEdit(index);
  };
  const handleDeletionOfTemplate = (templateCode) => {
    handleDeleteTemplate(templateCode);
    addAuditLog(`Delete Template: ${templateCode}`, `/api/v1/notifications/templates/${templateCode}`, 'success');
  };

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

  /**
   * Template management helpers from the UI
   * 1. CREATE -> Creates a new template for emails
   * 2. UPDATE -> Updates an existing template for emails
   * 3. DELETE -> Deletes an existing template for emails
   */
  const handleCreateTemplate = (formData) => {
    if (templates.some((t) => t.templateCode === formData.templateCode)) {
      setError('Template with this code already exists. Please try another name.');
      return;
    }
    createNotificationTemplate(formData)
      .then((res) => {
        if (res != null) {
          setTemplates([...templates, res]);
          setError("");
          addAuditLog("CREATE_TEMPLATE", "POST /api/v1/template", "SUCCESS");
          setTemplateCreate(false);
        } else {
          setError("Error during creation of template");
          addAuditLog("CREATE_TEMPLATE", "POST /api/v1/template", "FAILED");
        }
      })
      .catch((err) => {
        console.log(err);
      })
  };

  const handleUpdateTemplate = (formData) => {
    updateNotificationTemplate(formData)
      .then((res) => {
        if (res != null) {
          setTemplates(templates.map((t) => (t.templateCode === editingTemplate.templateCode ? res : t)));
          setEditingTemplate(null);
          addAuditLog('UPDATE_TEMPLATE', `PATCH /api/v1/template`, 'SUCCESS');
          setTemplateToEdit(-1);
        } else {
          setError("Error during updation of template");
          addAuditLog("UPDATE_TEMPLATE", "POST /api/v1/template", "FAILED");
        }
      })
      .catch((err) => {
        console.log(err);
      })

  };


  const checkPermission = (permission) => {
    if (!user?.attributes) return false;
    const permissions = user.attributes;
    return Object.keys(permissions).includes(permission);
  };

  const handleDeleteTemplate = (code) => {
    setTemplates(templates.filter((t) => t.code !== code));
    addAuditLog('Delete Template', `/api/v1/notifications/templates/${code}`, 'success');
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <ThemeProvider theme={notificationAdminTheme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (unauthorized) {
    return (
      <ThemeProvider theme={notificationAdminTheme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <Card sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
            <WarningIcon sx={{ fontSize: 80, color: '#F59E0B', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Access Denied
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              This dashboard is only accessible to Notification Service Administrators.
            </Typography>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={notificationAdminTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

        <NotificationAdminBar
        user = {user}
        setAuditDialogOpen = {setAuditDialogOpen}
        handleLogout = {handleLogout}
        />

        <Container maxWidth="lg" sx={{ pb: 4, pt: 4, px: isMobile ? 2 : 3 }}>
          {error 
          && 
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
          }

          <NotificationAdminTabs 
            listOfTabs = {listOfTabs}
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
          templatesList = {templates}
          checkPermission = {checkPermission}
          openCreateTemplateModal = {openCreateTemplateModal}
          openViewTemplateModal = {openViewTemplateModal}
          openUpdateTemplateModal = {openUpdateTemplateModal}
          handleDeleteTemplate = {handleDeletionOfTemplate}
          />
          }

          {tabValue === 2 && 
          <NotificationAdminSearchTab 
          setEmailLookupOpen = {setEmailLookupOpen}
          />
          }

        </Container>

        {/* Dialogs */}
        <TemplateCreateDialog
          open={templateCreate}
          onClose={() => {
            setTemplateCreate(false);
          }}
          onSave={handleCreateTemplate}
          canCreate={checkPermission(NOTIFICATION_TEMPLATE_CREATE_PERMISSION)}
        />

        <TemplateUpdateDialog
          open={templateToEdit !== -1}
          onClose={() => {
            setTemplateToEdit(-1)
          }}
          onSave={handleUpdateTemplate}
          canUpdate={checkPermission(NOTIFICATION_TEMPLATE_UPDATE_PERMISSION)}
          template={templates[templateToEdit]}
        />

        <TemplateViewDialog
          open={templateToView !== -1}
          onClose={() =>
            setTemplateToView(-1)
          }
          template={templates[templateToView]} />

        <EmailLookupDialog open={emailLookupOpen} onClose={() => setEmailLookupOpen(false)} />

        <AuditLogDialog open={auditDialogOpen} onClose={() => setAuditDialogOpen(false)} logs={auditLogs} />
      </Box>
    </ThemeProvider>
  );
}