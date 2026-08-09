import React from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography 
} from '@mui/material';

const ColoredStatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend
}) => {
    return (
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
}

export default ColoredStatCard;