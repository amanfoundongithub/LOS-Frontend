import { Box, Tabs, Tab, Chip } from '@mui/material';

export const AppTabs = ({
    listOfTabs = [],
    tabValue,
    setTabValue,
    variant = 'pills' // 'underline' | 'pills'
}) => {
    return (
        <Box
            sx={{
                mb: 3,
                borderBottom: variant === 'underline' ? '1px solid #E2E8F0' : 'none',
            }}
        >
            <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                TabIndicatorProps={{
                    sx: variant === 'pills' ? { display: 'none' } : {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                        backgroundColor: '#0F4C75',
                    },
                }}
                sx={{
                    minHeight: 44,
                    '& .MuiTabs-flexContainer': {
                        gap: variant === 'pills' ? 1 : 0,
                    },
                }}
            >
                {listOfTabs.map((tab, idx) => {
                    const isObject = typeof tab === 'object' && tab !== null;
                    const label = isObject ? tab.label : tab;
                    const icon = isObject ? tab.icon : undefined;
                    const badge = isObject ? tab.badge : undefined;
                    const disabled = isObject ? tab.disabled : false;
                    const value = isObject && tab.value !== undefined ? tab.value : idx;
                    const isSelected = tabValue === value;

                    return (
                        <Tab
                            key={isObject ? tab.id || label || idx : `${tab}-${idx}`}
                            value={value}
                            disabled={disabled}
                            icon={icon}
                            iconPosition="start"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>{label}</span>
                                    {badge !== undefined && (
                                        <Chip
                                            label={badge}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: '0.68rem',
                                                fontWeight: 700,
                                                backgroundColor: isSelected ? 'rgba(15, 76, 117, 0.12)' : '#F1F5F9',
                                                color: isSelected ? '#0F4C75' : '#8B92A1',
                                            }}
                                        />
                                    )}
                                </Box>
                            }
                            sx={{
                                textTransform: 'none',
                                fontWeight: isSelected ? 700 : 600,
                                fontSize: '0.875rem',
                                minHeight: 44,
                                px: 2.5,
                                py: 1,
                                borderRadius: variant === 'pills' ? '10px' : '8px 8px 0 0',
                                color: '#8B92A1',
                                transition: 'all 0.2s ease',
                                '&.Mui-selected': {
                                    color: '#0F4C75',
                                    backgroundColor: variant === 'pills' ? 'rgba(15, 76, 117, 0.08)' : 'transparent',
                                },
                                '&:hover': {
                                    color: '#0F4C75',
                                    backgroundColor: variant === 'pills' ? 'rgba(15, 76, 117, 0.04)' : 'rgba(15, 76, 117, 0.02)',
                                },
                            }}
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
};