import { Card, CardContent, Box, Typography } from '@mui/material';

export const StatisticCard = ({ title, value, icon: Icon, color, subtitle }) => (
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