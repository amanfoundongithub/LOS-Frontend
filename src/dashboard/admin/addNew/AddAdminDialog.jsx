import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Box,
    Typography,
    IconButton,
    Grid,
    InputAdornment
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getAllUserRoles } from '../http/user.all-roles';
import { convertToKeyAndValue } from '../../../maps/sort-helper.map';

// Add Admin User Dialog
export const AddAdminDialog = ({ open, onClose, onSave, loading = false }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        role: 'ADMIN',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [userRoles, setUserRoles] = useState([]);
    useEffect(() => {
        getAllUserRoles()
            .then((res) => {
                setUserRoles(convertToKeyAndValue(res));
            })
            .catch((err) => {
                console.log(`Error in fetching all user roles: ${err}`);
                setUserRoles([]);
            });
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
        if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
            setFormData({ username: '', email: '', phone: '', role: 'ADMIN', password: '' });
            setErrors({});
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 20px 40px -15px rgba(10, 53, 87, 0.15)',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                }
            }}
        >
            {/* Dialog Header */}
            <DialogTitle
                sx={{
                    p: 3,
                    pb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #F1F5F9',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(15, 76, 117, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <PersonAddIcon sx={{ color: '#0F4C75', fontSize: 24 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2332', fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
                            Add New Admin User
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8B92A1', fontSize: '0.8rem' }}>
                            Provision system privileges and credentials for a new administrator
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{
                        color: '#8B92A1',
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#F1F5F9', color: '#1A2332' }
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* Dialog Form Body */}
            <DialogContent sx={{ px: 3, py: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            error={!!errors.username}
                            helperText={errors.username}
                            placeholder="e.g. jdoe_admin"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={!!errors.email}
                            helperText={errors.email}
                            placeholder="admin@organization.com"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone Number (Optional)"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.role}>
                            <InputLabel id="role-select-label">Role Privilege</InputLabel>
                            <Select
                                labelId="role-select-label"
                                label="Role Privilege"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                {
                                    userRoles.map((item) => {
                                        return <MenuItem key={item.key} value={item.value}>{item.key}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Temporary Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={!!errors.password}
                            helperText={errors.password || 'User will be prompted to change password upon first login.'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                            sx={{ color: '#8B92A1' }}
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            {/* Dialog Footer Actions */}
            <DialogActions
                sx={{
                    p: 3,
                    pt: 2,
                    gap: 1.5,
                    borderTop: '1px solid #F1F5F9',
                    backgroundColor: '#FAFAFA'
                }}
            >
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        borderRadius: '10px',
                        px: 3,
                        py: 1,
                        color: '#64748B',
                        borderColor: '#CBD5E1',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        '&:hover': {
                            borderColor: '#94A3B8',
                            backgroundColor: '#F8FAFC',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={!loading && <PersonAddIcon />}
                    sx={{
                        borderRadius: '10px',
                        px: 3.5,
                        py: 1,
                        backgroundColor: '#0F4C75',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        boxShadow: '0 4px 14px rgba(15, 76, 117, 0.25)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#1A6B9D',
                            boxShadow: '0 6px 18px rgba(26, 107, 157, 0.35)',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={22} sx={{ color: '#FFFFFF' }} /> : 'Create Admin User'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};