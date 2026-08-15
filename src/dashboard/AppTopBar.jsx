import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider, 
  ListItemIcon, 
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/HistoryRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import { brandingConfig } from "../shared/config/apexLending-branding.config";

export const AppTopBar = ({
    roleString,
    user,
    onLogout,
    onOpenAuditLog
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogoutClick = () => {
        handleMenuClose();
        if (onLogout) onLogout();
    };

    const handleAuditClick = () => {
        handleMenuClose();
        if (onOpenAuditLog) onOpenAuditLog();
    };

    const userInitial = user?.username?.charAt(0).toUpperCase() || 'U';

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{
                bgcolor: '#0F4C75',
                borderBottom: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                boxShadow: '0 4px 20px -5px rgba(15, 76, 117, 0.4)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, sm: 70 }, px: { xs: 2, sm: 3 } }}>
                {/* Left Section: Brand Logo & App Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                        sx={{ 
                            width: 44, 
                            height: 44, 
                            borderRadius: 2.5, 
                            background: 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 100%)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 800, 
                            fontSize: '22px', 
                            color: '#0F4C75',
                            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                            flexShrink: 0
                        }}
                    >
                        {brandingConfig?.TITLE?.[0] || 'A'}
                    </Box>
                    
                    <Box>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 800, 
                                lineHeight: 1.2, 
                                letterSpacing: '-0.01em',
                                fontSize: { xs: '1rem', sm: '1.125rem' }
                            }}
                        >
                            {brandingConfig?.TITLE || 'Apex Lending'}
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontSize: '0.75rem', 
                                color: 'rgba(255, 255, 255, 0.75)', 
                                fontWeight: 500,
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            {roleString}
                        </Typography>
                    </Box>
                </Box>

                {/* Right Section: User Info & Menu Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography 
                        sx={{ 
                            color: '#ffffff', 
                            fontWeight: 600, 
                            fontSize: '0.875rem',
                            display: { xs: 'none', md: 'block' } 
                        }}
                    >
                        Welcome, <Box component="span" sx={{ color: '#D4AF37' }}>{user?.username}</Box>
                    </Typography>

                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            sx={{
                                p: 0.5,
                                border: '2px solid',
                                borderColor: open ? '#D4AF37' : 'transparent',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: '#D4AF37',
                                }
                            }}
                        >
                            <Avatar 
                                sx={{ 
                                    width: 38,
                                    height: 38,
                                    bgcolor: '#D4AF37', 
                                    color: '#0F4C75', 
                                    fontWeight: 800, 
                                    fontSize: '0.95rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                            >
                                {userInitial}
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    {/* Popover Dropdown Menu */}
                    <Menu 
                        anchorEl={anchorEl} 
                        open={open} 
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.15))',
                                mt: 1.5,
                                width: 240,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                p: 1,
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 18,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                    borderTop: '1px solid',
                                    borderLeft: '1px solid',
                                    borderColor: 'grey.200',
                                },
                            },
                        }}
                    >
                        {/* Profile Summary Header inside Menu */}
                        <Box sx={{ px: 1.5, py: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                                {user?.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, wordBreak: 'break-all' }}>
                                {user?.email || 'admin@apexlending.com'}
                            </Typography>
                            <Chip 
                                label={roleString || 'Administrator'} 
                                size="small" 
                                sx={{ 
                                    height: 20, 
                                    fontSize: '0.65rem', 
                                    fontWeight: 700, 
                                    bgcolor: 'primary.50', 
                                    color: 'primary.main',
                                    border: '1px solid',
                                    borderColor: 'primary.100'
                                }} 
                            />
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Menu Actions */}
                        <MenuItem 
                            onClick={handleAuditClick}
                            sx={{ 
                                borderRadius: 2, 
                                py: 1, 
                                fontSize: '0.875rem', 
                                fontWeight: 500,
                                '&:hover': { bgcolor: 'grey.50' }
                            }}
                        >
                            <ListItemIcon>
                                <HistoryIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </ListItemIcon>
                            Audit Log
                        </MenuItem>

                        <MenuItem 
                            onClick={handleLogoutClick}
                            sx={{ 
                                borderRadius: 2, 
                                py: 1, 
                                fontSize: '0.875rem', 
                                fontWeight: 600,
                                color: 'error.main',
                                '&:hover': { bgcolor: 'error.50' }
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};