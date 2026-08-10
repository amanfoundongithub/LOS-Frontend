
import { Typography, Grid, Card, CardContent, Box, LinearProgress } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';
import ColoredStatCard from '../../components/ColoredStatCard';

export const AdminStatistics = ({
    stats
}) => {

    return (
        <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                User Statistics At A Glance
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <ColoredStatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={GroupsIcon}
                        color="#3B82F6"
                        trend={{ isPositive: true, value: 12 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ColoredStatCard
                        title="Active Users"
                        value={stats.activeUsers}
                        icon={CheckCircleIcon}
                        color="#10B981"
                        subtitle="Currently non-locked users"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ColoredStatCard
                        title="Locked Users"
                        value={stats.lockedUsers}
                        icon={BlockIcon}
                        color="#EF4444"
                        trend={{ isPositive: false, value: 5 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ColoredStatCard
                        title="Admin Users"
                        value={stats.adminUsers}
                        icon={VerifiedUserIcon}
                        color="#D4AF37"
                        subtitle="All service admin(s)"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* <Grid item xs={12} md={6}>
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
                </Grid> */}

                {/* <Grid item xs={12} md={6}>
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
                </Grid> */}
            </Grid>
        </>
    )
}