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
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  LinearProgress,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { getUserProfile } from '../../shared/session/profile.loader';

const theme = createTheme({
  palette: {
    primary: { main: '#0F4C75', light: '#1A6B9D', dark: '#0A3557' },
    secondary: { main: '#D4AF37', light: '#E5C158', dark: '#A68625' },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: { primary: '#1A2332', secondary: '#8B92A1' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.8rem', color: '#1A2332' },
    h5: { fontWeight: 600, fontSize: '1.1rem', color: '#1A2332' },
    h6: { fontWeight: 600, fontSize: '0.95rem', color: '#8B92A1' },
  },
});

const PERMISSIONS = {
  NOTIFICATION_TEMPLATE_CREATE: 'notificationTemplate:create',
  NOTIFICATION_TEMPLATE_UPDATE: 'notificationTemplate:update',
  NOTIFICATION_TEMPLATE_DELETE: 'notificationTemplate:delete',
  NOTIFICATION_TEMPLATE_READ: 'notificationTemplate:read',
};

const getAuthToken = () => localStorage.getItem('access_token');

// HTML Validation Function
const isValidHtml = (html) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return !doc.querySelector('parsererror') && html.includes('<html') && html.includes('</html>');
  } catch (e) {
    return false;
  }
};

// HTML Beautification Function
const formatHtml = (html) => {
  let formatted = '';
  let indent = 0;
  const indentString = '  ';

  html = html.replace(/>\s+</g, '><'); // Remove spaces between tags

  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      let endTag = html.indexOf('>', i);
      let tag = html.substring(i, endTag + 1);

      if (tag.startsWith('</')) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        formatted += indentString.repeat(indent) + tag + '\n';
      } else if (tag.endsWith('/>')) {
        // Self-closing tag
        formatted += indentString.repeat(indent) + tag + '\n';
      } else if (tag.startsWith('<!') || tag.startsWith('<?')) {
        // DOCTYPE or XML declaration
        formatted += tag + '\n';
      } else {
        // Opening tag
        formatted += indentString.repeat(indent) + tag + '\n';
        indent++;
      }
      i = endTag + 1;
    } else {
      let nextTag = html.indexOf('<', i);
      if (nextTag === -1) nextTag = html.length;
      let text = html.substring(i, nextTag).trim();
      if (text) {
        formatted += indentString.repeat(indent) + text + '\n';
      }
      i = nextTag;
    }
  }

  return formatted;
};

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

// Template Dialog Component
const TemplateDialog = ({ open, onClose, onSave, template = null, isEdit = false, canCreate = true, existingTemplates = [] }) => {
  const [formData, setFormData] = useState({
    code: template?.code || '',
    name: template?.name || '',
    subject: template?.subject || '',
    htmlContent: template?.htmlContent || '',
  });
  const [errors, setErrors] = useState({});
  const [htmlError, setHtmlError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) newErrors.code = 'Template code is required';
    if (!formData.name.trim()) newErrors.name = 'Template name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.htmlContent.trim()) newErrors.htmlContent = 'HTML content is required';

    // Check for duplicate code (only when creating, not editing)
    if (!isEdit && existingTemplates.some((t) => t.code === formData.code)) {
      newErrors.code = 'This template code already exists';
      setHtmlError('Template with this code already exists');
    }

    // Validate HTML
    if (formData.htmlContent && !isValidHtml(formData.htmlContent)) {
      setHtmlError('Invalid HTML structure. Ensure it has <html> and </html> tags');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      setFormData({ code: '', name: '', subject: '', htmlContent: '' });
      setErrors({});
      setHtmlError('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Email Template' : 'Create New Email Template'}</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {!canCreate && !isEdit && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You do not have permission to create templates
          </Alert>
        )}

        <TextField
          fullWidth
          label="Template Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          error={!!errors.code}
          helperText={errors.code}
          disabled={isEdit || !canCreate}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Template Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          disabled={!canCreate && !isEdit}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          error={!!errors.subject}
          helperText={errors.subject}
          disabled={!canCreate && !isEdit}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={8}
          label="HTML Content"
          value={formData.htmlContent}
          onChange={(e) => {
            setFormData({ ...formData, htmlContent: e.target.value });
            setHtmlError('');
          }}
          error={!!errors.htmlContent || !!htmlError}
          helperText={errors.htmlContent || htmlError || 'Valid HTML with <html></html> tags'}
          disabled={!canCreate && !isEdit}
          sx={{ mb: 2, fontFamily: 'monospace' }}
          placeholder='<html><body><h1>Hello</h1></body></html>'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!canCreate && !isEdit}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Template View Dialog
const TemplateViewDialog = ({ open, onClose, template = null }) => {
  const formattedHtml = template?.htmlContent ? formatHtml(template.htmlContent) : '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
        📧 View Email Template: {template?.name}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                Template Code
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  backgroundColor: '#F3F4F6',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: '#0F4C75',
                  fontWeight: 600,
                }}
              >
                {template?.code}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                Email Subject
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  backgroundColor: '#F3F4F6',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: '#1A2332',
                }}
              >
                {template?.subject}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          📝 Formatted HTML Content
        </Typography>

        {template?.htmlContent ? (
          <Box>
            <Box
              sx={{
                border: '2px solid #D4AF37',
                borderRadius: '8px',
                p: 2,
                backgroundColor: '#FAFAF7',
                maxHeight: '600px',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.8rem',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  lineHeight: '1.6',
                  color: '#0F4C75',
                  '& > span': {
                    display: 'block',
                  },
                }}
              >
                {formattedHtml.split('\n').map((line, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      '&:hover': {
                        backgroundColor: 'rgba(15, 76, 117, 0.05)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: '#8B92A1',
                        mr: 2,
                        minWidth: '40px',
                        textAlign: 'right',
                        userSelect: 'none',
                        fontSize: '0.75rem',
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Box sx={{ flex: 1, color: '#0F4C75' }}>
                      {line || ' '}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 2,
                color: '#8B92A1',
                fontStyle: 'italic',
              }}
            >
              💡 HTML is formatted with proper indentation for readability. Line numbers shown on the left.
            </Typography>
          </Box>
        ) : (
          <Alert severity="info">No HTML content available for this template</Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

// Audit Log Dialog
const AuditLogDialog = ({ open, onClose, logs = [] }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Audit Log - Recent API Calls</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Endpoint</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{log.action}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.endpoint}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.status}
                      size="small"
                      color={log.status === 'success' ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default function NotificationAdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Template Management States
  const [templates, setTemplates] = useState([
    { code: 'welcome_email', name: 'Welcome Email', subject: 'Welcome to Apex Lending', htmlContent: '<html><body><h1>Welcome!</h1></body></html>' },
    { code: 'password_reset', name: 'Password Reset', subject: 'Reset Your Password', htmlContent: '<html><body><p>Click to reset</p></body></html>' },
  ]);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [viewTemplateDialogOpen, setViewTemplateDialogOpen] = useState(false);

  // Email Lookup State
  const [emailLookupOpen, setEmailLookupOpen] = useState(false);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);

  // Email Stats
  const [emailStats, setEmailStats] = useState({ sentCount: 24850, failedCount: 342, pendingCount: 156 });

  const themeInstance = useTheme();
  const isMobile = useMediaQuery(themeInstance.breakpoints.down('md'));

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = getAuthToken();

      if (!token) {
        setError('No authentication token found');
        setTimeout(() => (window.location.href = '/login'), 2000);
        return;
      }

      // Mock user data
      const userData = {
        id: 'user-123',
        username: 'john_admin',
        email: 'john@example.com',
        status: 'ACTIVE',
        attributes: {
          role: 'NOTIFICATION_SERVICE_ADMIN',
          permissions: [
            'notificationTemplate:read',
            'notificationTemplate:create',
            'notificationTemplate:update',
            'notificationTemplate:delete',
          ],
        },
      };

      setUser(userData);
      addAuditLog('Fetch User Data', '/api/v1/users/me', 'success');
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data');
      setLoading(false);
    }
  };

  const checkPermission = (permission) => {
    if (!user?.attributes) return false;
    const permissions = user.attributes.permissions || [];
    return permissions.includes(permission);
  };

  const addAuditLog = (action, endpoint, status) => {
    setAuditLogs((prev) => [{ timestamp: new Date(), action, endpoint, status }, ...prev.slice(0, 49)]);
  };

  const handleCreateTemplate = (formData) => {
    if (templates.some((t) => t.code === formData.code)) {
      setError('Template with this code already exists');
      return;
    }

    setTemplates([...templates, formData]);
    setTemplateDialogOpen(false);
    addAuditLog('Create Template', '/api/v1/notifications/templates', 'success');
    setError('');
  };

  const handleUpdateTemplate = (formData) => {
    setTemplates(templates.map((t) => (t.code === editingTemplate.code ? formData : t)));
    setTemplateDialogOpen(false);
    setEditingTemplate(null);
    addAuditLog('Update Template', `/api/v1/notifications/templates/${formData.code}`, 'success');
  };

  const handleDeleteTemplate = (code) => {
    setTemplates(templates.filter((t) => t.code !== code));
    addAuditLog('Delete Template', `/api/v1/notifications/templates/${code}`, 'success');
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (unauthorized) {
    return (
      <ThemeProvider theme={theme}>
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
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        {/* App Bar */}
        <AppBar position="sticky">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#0F4C75' }}>
                A
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Apex Lending
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                  Notification Admin
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ color: '#fff', fontWeight: 500 }}>Welcome, {user?.username}</Typography>
              <Avatar sx={{ background: '#D4AF37', color: '#0F4C75', fontWeight: 700, cursor: 'pointer' }} onClick={handleMenuOpen}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setAuditDialogOpen(true)}>
                  <HistoryIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Audit Log
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#EF4444' }} />
                  <Typography sx={{ color: '#EF4444' }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ pb: 4, pt: 4, px: isMobile ? 2 : 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Dashboard" />
              <Tab label="Email Templates" />
              <Tab label="Search" />
            </Tabs>
          </Box>

          {/* Tab 0: Dashboard */}
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

              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔐 Your Permissions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {Object.values(PERMISSIONS).map((permission) => (
                    <Chip
                      key={permission}
                      label={permission}
                      color={checkPermission(permission) ? 'success' : 'error'}
                      variant={checkPermission(permission) ? 'filled' : 'outlined'}
                      icon={checkPermission(permission) ? <CheckCircleIcon /> : <WarningIcon />}
                      size="medium"
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.85rem',
                      }}
                    />
                  ))}
                </Box>
              </Card>

              {/* Summary Info Card */}
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

          {/* Tab 1: Email Templates */}
          {tabValue === 1 && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 2 : 0,
                }}
              >
                <Typography variant="h5">📧 Email Templates</Typography>
                {checkPermission(PERMISSIONS.NOTIFICATION_TEMPLATE_CREATE) && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingTemplate(null);
                      setTemplateDialogOpen(true);
                    }}
                    fullWidth={isMobile}
                  >
                    + Create Template
                  </Button>
                )}
              </Box>

              {templates.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <MailIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
                  <Typography color="textSecondary">No templates created yet</Typography>
                </Card>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} sx={{ display: isMobile ? 'none' : 'table-cell' }}>
                          Subject
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {templates.map((template) => (
                        <TableRow key={template.code} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#0F4C75', fontWeight: 600 }}>
                            {template.code}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{template.name}</TableCell>
                          <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#8B92A1' }}>
                            {template.subject}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 0.5,
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                              }}
                            >
                              {checkPermission(PERMISSIONS.NOTIFICATION_TEMPLATE_READ) && (
                                <IconButton
                                  size="small"
                                  title="View"
                                  onClick={() => {
                                    setViewingTemplate(template);
                                    setViewTemplateDialogOpen(true);
                                  }}
                                  sx={{
                                    color: '#10B981',
                                    '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              )}
                              {checkPermission(PERMISSIONS.NOTIFICATION_TEMPLATE_UPDATE) && (
                                <IconButton
                                  size="small"
                                  title="Edit"
                                  onClick={() => {
                                    setEditingTemplate(template);
                                    setTemplateDialogOpen(true);
                                  }}
                                  sx={{
                                    color: '#0F4C75',
                                    '&:hover': { backgroundColor: 'rgba(15, 76, 117, 0.1)' },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              )}
                              {checkPermission(PERMISSIONS.NOTIFICATION_TEMPLATE_DELETE) && (
                                <IconButton
                                  size="small"
                                  title="Delete"
                                  onClick={() => {
                                    handleDeleteTemplate(template.code);
                                    addAuditLog(`Delete Template: ${template.code}`, `/api/v1/notifications/templates/${template.code}`, 'success');
                                  }}
                                  sx={{
                                    color: '#EF4444',
                                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          {/* Tab 2: Search */}
          {tabValue === 2 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Search Emails & Templates</Typography>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={() => setEmailLookupOpen(true)}>
                  Open Search
                </Button>
              </Box>

              <Card>
                <CardContent>
                  <Typography color="textSecondary">Click the "Open Search" button to search by:</Typography>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">• <strong>Tracking ID</strong> - Find specific email deliveries</Typography>
                    <Typography variant="body2">• <strong>Email Recipient</strong> - Search emails sent to a specific recipient</Typography>
                    <Typography variant="body2">• <strong>Template Code</strong> - View template usage and statistics</Typography>
                  </Box>
                </CardContent>
              </Card>
            </>
          )}
        </Container>

        {/* Dialogs */}
        <TemplateDialog
          open={templateDialogOpen}
          onClose={() => {
            setTemplateDialogOpen(false);
            setEditingTemplate(null);
          }}
          onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          template={editingTemplate}
          isEdit={!!editingTemplate}
          canCreate={checkPermission(PERMISSIONS.NOTIFICATION_TEMPLATE_CREATE)}
          existingTemplates={templates}
        />

        <TemplateViewDialog open={viewTemplateDialogOpen} onClose={() => setViewTemplateDialogOpen(false)} template={viewingTemplate} />

        <EmailLookupDialog open={emailLookupOpen} onClose={() => setEmailLookupOpen(false)} />

        <AuditLogDialog open={auditDialogOpen} onClose={() => setAuditDialogOpen(false)} logs={auditLogs} />
      </Box>
    </ThemeProvider>
  );
}