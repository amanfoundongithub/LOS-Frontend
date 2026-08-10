import React from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Chip 
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

const ColoredStatCard = ({
    title,
    value,
    icon: Icon,
    color = '#10B981',
    subtitle,
    trend
}) => {
    const isPositiveTrend = trend?.isPositive;

    return (
        <Card 
            elevation={0}
            sx={{ 
                height: '100%', 
                borderRadius: 4,
                background: `linear-gradient(135deg, ${color}12 0%, ${color}04 100%)`,
                border: '1px solid',
                borderColor: `${color}25`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 24px -6px ${color}25`,
                    borderColor: `${color}40`,
                }
            }}
        >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Title */}
                        <Typography 
                            variant="caption"
                            sx={{ 
                                color: 'text.secondary', 
                                fontSize: '0.8125rem', 
                                fontWeight: 600, 
                                display: 'block',
                                mb: 0.75,
                                letterSpacing: '0.01em'
                            }}
                        >
                            {title}
                        </Typography>

                        {/* Main Value */}
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                color, 
                                fontWeight: 800, 
                                letterSpacing: '-0.02em',
                                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                                lineHeight: 1.2,
                                mb: 0.5
                            }}
                        >
                            {value}
                        </Typography>

                        {/* Subtitle */}
                        {subtitle && (
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    fontSize: '0.8rem', 
                                    color: 'text.secondary',
                                    fontWeight: 400
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}

                        {/* Trend Chip Badge */}
                        {trend && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                                <Chip
                                    size="small"
                                    icon={isPositiveTrend ? <TrendingUpRoundedIcon style={{ fontSize: 14 }} /> : <TrendingDownRoundedIcon style={{ fontSize: 14 }} />}
                                    label={`${isPositiveTrend ? '+' : ''}${trend.value}%`}
                                    sx={{
                                        height: 22,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        bgcolor: isPositiveTrend ? 'success.50' : 'error.50',
                                        color: isPositiveTrend ? 'success.main' : 'error.main',
                                        border: '1px solid',
                                        borderColor: isPositiveTrend ? 'success.200' : 'error.200',
                                        '& .MuiChip-icon': {
                                            color: 'inherit',
                                            ml: 0.5
                                        },
                                        '& .MuiChip-label': {
                                            px: 0.75
                                        }
                                    }}
                                />
                                <Typography 
                                    variant="caption" 
                                    sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}
                                >
                                    vs last month
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Styled Icon Container */}
                    {Icon && (
                        <Box
                            sx={{
                                width: { xs: 48, sm: 52 },
                                height: { xs: 48, sm: 52 },
                                borderRadius: 3,
                                bgcolor: `${color}18`,
                                border: '1px solid',
                                borderColor: `${color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Icon sx={{ fontSize: { xs: 26, sm: 28 }, color }} />
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ColoredStatCard;