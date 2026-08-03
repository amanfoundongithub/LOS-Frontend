import { ThemeProvider } from "@mui/material/styles"
import { Box, Card, Typography, Button } from "@mui/material"
import WarningIcon from "@mui/icons-material/Warning"
import { adminTheme } from "../themes/notification_admin.theme"

export const UnauthorizedEntryPage = ({
    title,
    message
}) => {
    const handleLogout = () => {

    }
    return(
        <ThemeProvider theme={adminTheme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <Card sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
            <WarningIcon sx={{ fontSize: 80, color: '#F59E0B', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                {title}
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
                {message}
            </Typography>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Card>
        </Box>
      </ThemeProvider>
    )
}