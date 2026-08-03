import { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { brandingConfig } from "../shared/config/apexLending-branding.config";

export const AppTopBar = ({
    roleString,
    user
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {

    }
    const setAuditDialogOpen = (f) => {
        
    }
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#0F4C75' }}>
                        {brandingConfig.TITLE[0]}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {brandingConfig.TITLE}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                            {roleString}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                        Welcome, {user?.username}
                    </Typography>
                    <Avatar sx={{ background: '#D4AF37', color: '#0F4C75', fontWeight: 700, cursor: 'pointer' }} onClick={handleMenuOpen}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem disabled>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user?.email}
                            </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => setAuditDialogOpen(true)}>
                            <HistoryIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Audit Log
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#EF4444' }} />
                            <Typography sx={{ color: '#EF4444' }}>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}