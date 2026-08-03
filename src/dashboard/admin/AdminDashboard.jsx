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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  LinearProgress,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import { UnauthorizedEntryPage } from '../../shared/UnauthorizedEntryPage';
import { LoadingPage } from '../../shared/LoadingPage';
import { getUserProfile } from '../../shared/session/profile.loader';
import { checkIfIAMAdmin } from '../../shared/session/permission.checker';
import { AppTopBar } from '../AppTopBar';
import { adminTheme } from '../../themes/notification_admin.theme';
import { AppTabs } from '../AppTabs';
import { searchAllUsers } from './http/admin.search-users';
import { AdminUserManagementComponent } from './components/AdminUserManagement';
import { useIsDeviceMobile } from '../../utils/device.util';


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
  const [users, setUsers] = useState([]);

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

  const isMobile = useIsDeviceMobile();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile();
      const allUsers = await searchAllUsers();
      setUsers(allUsers);
      setUser(userProfile);
      setUnauthorized(!checkIfIAMAdmin(userProfile));
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
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

          {tabValue === 1 && 
            <AdminUserManagementComponent
            users={users}
            setUsers={setUsers}
            />
          }

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