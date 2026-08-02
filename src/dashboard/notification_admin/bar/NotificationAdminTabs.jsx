import {
    Box,
    Tabs,
    Tab
} from '@mui/material';

export const NotificationAdminTabs = ({
    listOfTabs,
    tabValue,
    setTabValue
}) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                {
                    listOfTabs.map((e, idx) => {
                        return <Tab label={e} />
                    })
                }
            </Tabs>
        </Box>
    )
}