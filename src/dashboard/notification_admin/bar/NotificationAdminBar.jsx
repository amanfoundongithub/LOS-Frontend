import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';

export const NotificationAdminBar = ({
    user,
    setAuditDialogOpen,
    handleLogout
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#0F4C75' }}>
                        A
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Apex Lending
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                            Notification Service Administrator
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