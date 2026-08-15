import { Box, Button, Card, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { CheckCircleOutlined, TrendingUp } from '@mui/icons-material';
import ColoredStatCard from '../../../components/ColoredStatCard';
import { NotificationAdminProfile } from '../profile/NotificationAdminProfile';
import MailIcon from '@mui/icons-material/Mail';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import QueueIcon from '@mui/icons-material/Queue';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useEffect, useState, useCallback } from 'react';
import { fetchStats } from '../../../shared/notification_admin/stats.fetch';

const NotificationAdminStatisticsTab = ({ user }) => {
    
    const checkPermission = (permission) => {
        if (!user?.attributes) return false;
        return Object.keys(user.attributes).includes(permission);
    };

    const [emailStats, setEmailStats] = useState({});
    const [errorInGettingStatistics, setErrorInGettingStatistics] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadStats = useCallback(() => {
        setLoading(true);
        setErrorInGettingStatistics(false);
        fetchStats()
            .then((res) => {
                setEmailStats(res);
            })
            .catch((err) => {
                console.error(`Error while fetching notification service statistics: ${err}`);
                setErrorInGettingStatistics(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    if (errorInGettingStatistics) {
        return (
            <Box sx={{ width: '100%', mb: 4 }}>
                <Card
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        mt: 2,
                        borderRadius: 4,
                        border: '1px dashed',
                        borderColor: 'error.200',
                        bgcolor: 'rgba(239, 68, 68, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minHeight: 360,
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'error.50',
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid',
                            borderColor: 'error.100',
                            mb: 2.5,
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)',
                        }}
                    >
                        <ErrorOutlineRoundedIcon sx={{ fontSize: 32 }} />
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            mb: 1,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Statistics Unavailable
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 440,
                            mb: 3,
                            lineHeight: 1.6,
                        }}
                    >
                        We couldn't fetch real-time telemetry from the notification service. Please verify your network connection or try reloading the data.
                    </Typography>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={loadStats}
                        disabled={loading}
                        startIcon={
                            loading ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <RefreshRoundedIcon />
                            )
                        }
                        sx={{
                            borderRadius: 2.5,
                            px: 3,
                            py: 1,
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                            },
                        }}
                    >
                        {loading ? 'Retrying...' : 'Retry Fetching Data'}
                    </Button>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
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

            {/* 3. Admin Profile & Permissions */}
            <NotificationAdminProfile checkPermission={checkPermission} />
        </Box>
    );
};

export default NotificationAdminStatisticsTab;