import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Box, Avatar, Typography, Chip, Button, TextField, Divider } from '@mui/material';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export const UserDetailsDialog = ({ open, onClose, user = null, onBlock, onUnblock }) => {
    const [blockReason, setBlockReason] = useState('');
    const [unblockReason, setUnblockReason] = useState('');
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleBlockClick = (type) => {
        setActionType(type);
        setActionDialogOpen(true);
    };

    const handleConfirmAction = () => {
        if (actionType === 'block' && blockReason.trim()) {
            onBlock(user.id, blockReason);
            setBlockReason('');
            setActionDialogOpen(false);
            onClose();
        } else if (actionType === 'unblock' && unblockReason.trim()) {
            onUnblock(user.id, unblockReason);
            setUnblockReason('');
            setActionDialogOpen(false);
            onClose();
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon /> User Details
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {user && (
                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)',
                                            color: '#1A1A2E',
                                            fontWeight: 700,
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        {user.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {user.username}
                                        </Typography>
                                        <Chip
                                            label={user.status}
                                            color={user.status === 'ACTIVE' ? 'success' : 'error'}
                                            size="small"
                                            icon={user.status === 'ACTIVE' ? <CheckCircleIcon /> : <BlockIcon />}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        Email
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EmailIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                                        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{user.email}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        Role
                                    </Typography>
                                    <Chip
                                        icon={<VerifiedUserIcon />}
                                        label={user.role}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        Phone
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                                        <Typography sx={{ fontSize: '0.9rem' }}>{user.phone || 'Not provided'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        Created Date
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DateRangeIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                                        <Typography sx={{ fontSize: '0.9rem' }}>{new Date(user.createdAt).toLocaleDateString()}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        User ID
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: '#F3F4F6', padding: '8px 12px', borderRadius: '6px', color: '#1A1A2E' }}>
                                        {user.id}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {user.status !== 'LOCKED' ? (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="error"
                                            startIcon={<BlockIcon />}
                                            onClick={() => handleBlockClick('block')}
                                        >
                                            Block User
                                        </Button>
                                    ) : (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="success"
                                            startIcon={<LockOpenIcon />}
                                            onClick={() => handleBlockClick('unblock')}
                                        >
                                            Unblock User
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {actionType === 'block' ? '🚫 Block User' : '🔓 Unblock User'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label={`${actionType === 'block' ? 'Block' : 'Unblock'} Reason`}
                        placeholder={`Enter reason for ${actionType === 'block' ? 'blocking' : 'unblocking'} this user...`}
                        value={actionType === 'block' ? blockReason : unblockReason}
                        onChange={(e) =>
                            actionType === 'block' ? setBlockReason(e.target.value) : setUnblockReason(e.target.value)
                        }
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        ℹ️ Reason is required and will be logged in audit trail
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color={actionType === 'block' ? 'error' : 'success'}
                        onClick={handleConfirmAction}
                        disabled={actionType === 'block' ? !blockReason.trim() : !unblockReason.trim()}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};