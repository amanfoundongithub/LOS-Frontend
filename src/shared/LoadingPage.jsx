import { ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import { adminTheme } from '../themes/notification_admin.theme';

export const LoadingPage = () => {
    return(
        <ThemeProvider theme={adminTheme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    )
}