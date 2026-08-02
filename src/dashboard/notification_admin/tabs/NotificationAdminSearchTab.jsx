import {
    Box,
    Button,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const NotificationAdminSearchTab = ({
    setEmailLookupOpen
}) => {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Search Emails & Templates</Typography>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={() => setEmailLookupOpen(true)}>
                    Open Search
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <Typography color="textSecondary">Click the "Open Search" button to search by:</Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">• <strong>Tracking ID</strong> - Find specific email deliveries</Typography>
                        <Typography variant="body2">• <strong>Email Recipient</strong> - Search emails sent to a specific recipient</Typography>
                        <Typography variant="body2">• <strong>Template Code</strong> - View template usage and statistics</Typography>
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}