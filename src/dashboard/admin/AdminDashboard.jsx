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
  Avatar,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  FormControl,
  Select,
  LinearProgress,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { UnauthorizedEntryPage } from '../../shared/UnauthorizedEntryPage';
import { LoadingPage } from '../../shared/LoadingPage';
import { getUserProfile } from '../../shared/session/profile.loader';
import { checkIfIAMAdmin } from '../../shared/session/permission.checker';
import { AppTopBar } from '../AppTopBar';
import { adminTheme } from '../../themes/notification_admin.theme';
import { AppTabs } from '../AppTabs';


// Statistics Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)` }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color, fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && <Typography sx={{ fontSize: '0.8rem', color: 'textSecondary' }}>{subtitle}</Typography>}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <Box sx={{ color: trend.isPositive ? '#10B981' : '#EF4444', fontWeight: 600, fontSize: '0.85rem' }}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'textSecondary' }}>vs last month</Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '12px',
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 32, color }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// User Details Dialog
const UserDetailsDialog = ({ open, onClose, user = null, onBlock, onUnblock }) => {
  const [blockReason, setBlockReason] = useState('');
  const [unblockReason, setUnblockReason] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'block' or 'unblock'

  const handleBlockClick = (type) => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'block' && blockReason.trim()) {
      onBlock(user.id, blockReason);
      setBlockReason('');
      setActionDialogOpen(false);
      onClose();
    } else if (actionType === 'unblock' && unblockReason.trim()) {
      onUnblock(user.id, unblockReason);
      setUnblockReason('');
      setActionDialogOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon /> User Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {user && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)',
                      color: '#1A1A2E',
                      fontWeight: 700,
                      fontSize: '1.5rem',
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {user.username}
                    </Typography>
                    <Chip
                      label={user.status}
                      color={user.status === 'ACTIVE' ? 'success' : 'error'}
                      size="small"
                      icon={user.status === 'ACTIVE' ? <CheckCircleIcon /> : <BlockIcon />}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Email
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                    <Typography sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{user.email}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Role
                  </Typography>
                  <Chip
                    icon={<VerifiedUserIcon />}
                    label={user.role}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Phone
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                    <Typography sx={{ fontSize: '0.9rem' }}>{user.phone || 'Not provided'}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Created Date
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRangeIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                    <Typography sx={{ fontSize: '0.9rem' }}>{new Date(user.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    User ID
                  </Typography>
                  <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: '#F3F4F6', padding: '8px 12px', borderRadius: '6px', color: '#1A1A2E' }}>
                    {user.id}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {user.status === 'ACTIVE' ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      startIcon={<BlockIcon />}
                      onClick={() => handleBlockClick('block')}
                    >
                      Block User
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<LockOpenIcon />}
                      onClick={() => handleBlockClick('unblock')}
                    >
                      Unblock User
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Reason Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionType === 'block' ? '🚫 Block User' : '🔓 Unblock User'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={`${actionType === 'block' ? 'Block' : 'Unblock'} Reason`}
            placeholder={`Enter reason for ${actionType === 'block' ? 'blocking' : 'unblocking'} this user...`}
            value={actionType === 'block' ? blockReason : unblockReason}
            onChange={(e) =>
              actionType === 'block' ? setBlockReason(e.target.value) : setUnblockReason(e.target.value)
            }
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            ℹ️ Reason is required and will be logged in audit trail
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={actionType === 'block' ? 'error' : 'success'}
            onClick={handleConfirmAction}
            disabled={actionType === 'block' ? !blockReason.trim() : !unblockReason.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Add Admin User Dialog
const AddAdminDialog = ({ open, onClose, onSave, loading = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'ADMIN',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      setFormData({ username: '', email: '', phone: '', role: 'ADMIN', password: '' });
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonAddIcon /> Add New Admin User
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          fullWidth
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          error={!!errors.username}
          helperText={errors.username}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone (Optional)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Role
          </Typography>
          <Select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Temporary Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={!!errors.password}
          helperText={errors.password || 'User will be asked to change on first login'}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Create Admin'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
export default function IAMAdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Users Management State
  const [users, setUsers] = useState([
    { id: 'user-1', username: 'john_doe', email: 'john@example.com', status: 'ACTIVE', role: 'CUSTOMER', phone: '+1-234-567-8900', createdAt: '2024-01-10' },
    { id: 'user-2', username: 'jane_smith', email: 'jane@example.com', status: 'ACTIVE', role: 'LOAN_OFFICER', phone: '+1-234-567-8901', createdAt: '2024-01-12' },
    { id: 'user-3', username: 'blocked_user', email: 'blocked@example.com', status: 'BLOCKED', role: 'CUSTOMER', phone: null, createdAt: '2023-12-15' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  // Add Admin State
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 234,
    activeUsers: 198,
    blockedUsers: 18,
    adminUsers: 5,
    lastMonthLogins: 4521,
    failedLogins: 43,
  });

  const themeInstance = useTheme();
  const isMobile = useMediaQuery(themeInstance.breakpoints.down('md'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile();
      setUser(userProfile);
      setUnauthorized(!checkIfIAMAdmin(userProfile));
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const handleUserClick = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUserDetailsOpen(true);
  };

  const handleBlockUser = (userId, reason) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: 'BLOCKED' } : u
      )
    );
    alert(`User blocked with reason: ${reason}`);
  };

  const handleUnblockUser = (userId, reason) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: 'ACTIVE' } : u
      )
    );
    alert(`User unblocked with reason: ${reason}`);
  };

  const handleAddAdmin = (formData) => {
    setAddAdminLoading(true);
    setTimeout(() => {
      setUsers([
        ...users,
        {
          id: `user-${Date.now()}`,
          username: formData.username,
          email: formData.email,
          status: 'ACTIVE',
          role: formData.role,
          phone: formData.phone || null,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]);
      setAddAdminLoading(false);
      setAddAdminOpen(false);
      alert(`Admin user ${formData.username} created successfully!`);
    }, 1500);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <LoadingPage 
      />
    );
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
              "📊 Statistics",
              "👥 Manage Users",
              "➕ Add Admin"
            ]}
            tabValue = {tabValue}
            setTabValue = {setTabValue}
            />
          </Box>

          {tabValue === 0 && (
            <>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                📈 Identity & Access Management Statistics
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={GroupsIcon}
                    color="#3B82F6"
                    trend={{ isPositive: true, value: 12 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Active Users"
                    value={stats.activeUsers}
                    icon={CheckCircleIcon}
                    color="#10B981"
                    subtitle="Currently active"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Blocked Users"
                    value={stats.blockedUsers}
                    icon={BlockIcon}
                    color="#EF4444"
                    trend={{ isPositive: false, value: 5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Admin Users"
                    value={stats.adminUsers}
                    icon={VerifiedUserIcon}
                    color="#D4AF37"
                    subtitle="Super admin + Admin"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        🔐 Login Activity
                      </Typography>
                      <Box sx={{ mb: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Successful Logins (This Month)</Typography>
                          <Typography sx={{ fontWeight: 700, color: '#10B981' }}>{stats.lastMonthLogins}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={95}
                          sx={{ height: 8, borderRadius: '4px', backgroundColor: '#E5E7EB' }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Failed Login Attempts</Typography>
                          <Typography sx={{ fontWeight: 700, color: '#EF4444' }}>{stats.failedLogins}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={8}
                          sx={{ height: 8, borderRadius: '4px', backgroundColor: '#FEE2E2' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        🛡️ Security Status
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: '#ECFDF5', borderRadius: '8px' }}>
                          <CheckCircleIcon sx={{ color: '#10B981' }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              All Systems Operational
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              No security threats detected
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
                          <WarningIcon sx={{ color: '#F59E0B' }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              2FA Adoption: 78%
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              22% users have not enabled 2FA
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: '#EFF6FF', borderRadius: '8px' }}>
                          <SecurityIcon sx={{ color: '#3B82F6' }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Password Policy Compliant
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              98% users meet security requirements
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}

          {/* Tab 1: Manage Users */}
          {tabValue === 1 && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  👥 User Management
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Box>

              {filteredUsers.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <PersonIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
                  <Typography color="textSecondary">No users found</Typography>
                </Card>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Created Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }} align="center">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((userItem) => (
                        <TableRow key={userItem.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: '#1A1A2E',
                              cursor: 'pointer',
                              '&:hover': { color: '#D4AF37' },
                            }}
                            onClick={() => handleUserClick(userItem)}
                          >
                            {userItem.username}
                          </TableCell>
                          <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                            {userItem.email}
                          </TableCell>
                          <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={userItem.status === 'ACTIVE' ? <CheckCircleIcon /> : <BlockIcon />}
                              label={userItem.status}
                              color={userItem.status === 'ACTIVE' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ display: isMobile ? 'none' : 'table-cell' }} align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleUserClick(userItem)}
                              sx={{
                                borderColor: '#D4AF37',
                                color: '#D4AF37',
                                '&:hover': {
                                  borderColor: '#1A1A2E',
                                  backgroundColor: '#1A1A2E',
                                  color: '#D4AF37',
                                },
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          {/* Tab 2: Add Admin */}
          {tabValue === 2 && (
            <>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonAddIcon /> Create New Admin User
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PersonAddIcon sx={{ fontSize: 80, color: '#D4AF37', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                        Add New Administrator
                      </Typography>
                      <Typography color="textSecondary" sx={{ mb: 3 }}>
                        Create a new admin user account with all required details
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => setAddAdminOpen(true)}
                        sx={{ mb: 2 }}
                      >
                        Create Admin User
                      </Button>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                      📋 Admin Creation Guide
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { title: 'Username', desc: 'Unique identifier for the admin' },
                        { title: 'Email', desc: 'Official work email address' },
                        { title: 'Role', desc: 'Admin or Super Admin permissions' },
                        { title: 'Password', desc: 'Temporary password (must change on first login)' },
                      ].map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 2, p: 2, backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                          <Box sx={{ color: '#D4AF37', fontWeight: 700, minWidth: '30px' }}>{idx + 1}</Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.desc}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Container>

        {/* Dialogs */}
        <UserDetailsDialog
          open={userDetailsOpen}
          onClose={() => setUserDetailsOpen(false)}
          user={selectedUser}
          onBlock={handleBlockUser}
          onUnblock={handleUnblockUser}
        />

        <AddAdminDialog
          open={addAdminOpen}
          onClose={() => setAddAdminOpen(false)}
          onSave={handleAddAdmin}
          loading={addAdminLoading}
        />
      </Box>
    </ThemeProvider>
  );
}