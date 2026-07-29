import { createTheme } from "@mui/material";


export const apexLendingTheme = createTheme({
    palette: {
        primary: {
            main: '#0F4C75',
            light: '#1A6B9D',
            dark: '#0A3557',
        },
        secondary: {
            main: '#D4AF37',
            light: '#E5C158',
            dark: '#A68625',
        },
        background: {
            default: '#FFFFFF',
            paper: '#F5F7FA',
        },
        text: {
            primary: '#1A2332',
            secondary: '#8B92A1',
        },
        success: {
            main: '#10B981',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            color: '#1A2332',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.3rem',
            color: '#1A2332',
        },
        body2: {
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#8B92A1',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1.5px solid #E0E4E8',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            borderColor: '#D4AF37',
                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.08)',
                        },
                        '&.Mui-focused': {
                            borderColor: '#0F4C75',
                            boxShadow: '0 0 0 3px rgba(15, 76, 117, 0.1)',
                        },
                        '& input': {
                            fontSize: '0.95rem',
                            padding: '12px 14px',
                        },
                        '& input::placeholder': {
                            color: '#C5CCDA',
                            opacity: 1,
                        },
                    },
                    '& .MuiOutlinedInput-input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px white inset',
                        WebkitTextFillColor: '#1A2332',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    background: 'linear-gradient(135deg, #0F4C75 0%, #1A6B9D 100%)',
                    boxShadow: '0 4px 12px rgba(15, 76, 117, 0.15)',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(15, 76, 117, 0.25)',
                        transform: 'translateY(-2px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    '&.Mui-checked': {
                        color: '#0F4C75',
                    },
                },
            },
        },
    },
});