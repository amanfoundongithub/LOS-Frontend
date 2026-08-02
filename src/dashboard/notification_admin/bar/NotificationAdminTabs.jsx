import {
    Box,
    Tabs,
    Tab
} from '@mui/material';

const listOfTabs = [
  "Dashboard",
  "Email Templates",
  "Search"
];

export const NotificationAdminTabs = ({
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