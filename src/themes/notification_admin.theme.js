import { createTheme } from "@mui/material";

export const adminTheme = createTheme({
  palette: {
    primary: { main: '#0F4C75', light: '#1A6B9D', dark: '#0A3557' },
    secondary: { main: '#D4AF37', light: '#E5C158', dark: '#A68625' },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: { primary: '#1A2332', secondary: '#8B92A1' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.8rem', color: '#1A2332' },
    h5: { fontWeight: 600, fontSize: '1.1rem', color: '#1A2332' },
    h6: { fontWeight: 600, fontSize: '0.95rem', color: '#8B92A1' },
  },
});