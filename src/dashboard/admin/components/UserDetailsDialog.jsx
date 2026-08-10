import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Box,
    Avatar,
    Typography,
    Chip,
    Button,
    TextField,
    IconButton,
    Paper
} from '@mui/material';
import { useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close';
import UserStatusChip from '../../../components/UserStatusChip';
import { blockUser } from '../http/admin.block-user';
import { unblockUser } from '../http/admin.unblock-user';

export const UserDetailsDialog = ({ 
    open, 
    setOpen, 
    user = null,
    users, 
    setUsers 
}) => {
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
            onBlockUser(user.id, blockReason);
            setBlockReason('');
            setActionDialogOpen(false);
            setOpen(false);
        } else if (actionType === 'unblock' && unblockReason.trim()) {
            onUnblockUser(user.id, unblockReason);
            setUnblockReason('');
            setActionDialogOpen(false);
            setOpen(false);
        }
    };

    const onBlockUser = (userId, reason) => {
        blockUser({ reason, userId })
            .then(() => {
                setUsers(users.map((u) => u.id === userId ? { ...u, status: 'LOCKED' } : u));
            })
            .catch((err) => {
                console.log(`Error while blocking user: ${err}`);
            });
    };
    const onUnblockUser = (userId, reason) => {
        unblockUser({ reason, userId })
            .then(() => {
                setUsers(users.map((u) => u.id === userId ? { ...u, status: 'ACTIVE' } : u));
            })
            .catch((err) => {
                console.log(`Error while unblocking user: ${err}`);
            })
    };

    const InfoTile = ({ icon: Icon, label, value, isCode = false }) => (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: '14px',
                backgroundColor: '#F4F7FA',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: '#1A6B9D',
                    boxShadow: '0 4px 12px rgba(15, 76, 117, 0.06)',
                },
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    backgroundColor: 'rgba(15, 76, 117, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <Icon sx={{ fontSize: 20, color: '#0F4C75' }} />
            </Box>
            <Box sx={{ overflow: 'hidden', width: '100%' }}>
                <Typography variant="caption" sx={{ color: '#8B92A1', fontWeight: 600, display: 'block', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                    {label}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: isCode ? 600 : 500,
                        color: '#1A2332',
                        fontFamily: isCode ? 'monospace' : 'inherit',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Paper>
    );

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(10, 53, 87, 0.25)',
                    },
                }}
            >
                {user && (
                    <>
                        {/* Banner Header */}
                        <Box
                            sx={{
                                position: 'relative',
                                background: 'linear-gradient(135deg, #0A3557 0%, #0F4C75 100%)',
                                color: '#FFFFFF',
                                pt: 4,
                                pb: 3.5,
                                px: 3.5,
                            }}
                        >
                            <IconButton
                                onClick={() => setOpen(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    top: 16,
                                    color: 'rgba(255,255,255,0.7)',
                                    '&:hover': { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.12)' },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <Avatar
                                    sx={{
                                        width: 68,
                                        height: 68,
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)',
                                        color: '#0A3557',
                                        fontWeight: 800,
                                        fontSize: '1.75rem',
                                        boxShadow: '0 8px 16px rgba(10, 53, 87, 0.4)',
                                        border: '3px solid rgba(255, 255, 255, 0.2)',
                                    }}
                                >
                                    {user.username?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                                            {user.username}
                                        </Typography>
                                        <UserStatusChip userStatus={user.status} />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.85rem' }}>
                                        Account Details & Permissions
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <DialogContent sx={{ p: 3.5, backgroundColor: '#FFFFFF' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoTile icon={EmailIcon} label="Email Address" value={user.email} isCode />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            borderRadius: '14px',
                                            backgroundColor: '#F4F7FA',
                                            border: '1px solid #E2E8F0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#1A6B9D',
                                                boxShadow: '0 4px 12px rgba(15, 76, 117, 0.06)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '10px',
                                                backgroundColor: 'rgba(15, 76, 117, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <VerifiedUserIcon sx={{ fontSize: 20, color: '#0F4C75' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#8B92A1', fontWeight: 600, display: 'block', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                                                Role
                                            </Typography>
                                            <Chip
                                                label={user.attributes?.userRole}
                                                size="small"
                                                sx={{
                                                    mt: 0.2,
                                                    fontWeight: 700,
                                                    fontSize: '0.72rem',
                                                    height: 22,
                                                    backgroundColor: '#0F4C75',
                                                    color: '#FFFFFF',
                                                }}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoTile icon={PhoneIcon} label="Phone Number" value={user.phone || 'Not provided'} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoTile icon={DateRangeIcon} label="Account Created Date" value={new Date(user.createdDate).toLocaleDateString()} />
                                </Grid>
                            </Grid>
                        </DialogContent>

                        {/* Sticky Action Footer */}
                        <DialogActions
                            sx={{
                                px: 3.5,
                                py: 2.5,
                                backgroundColor: '#F9FAFB',
                                borderTop: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1.5,
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={() => setOpen(false)}
                                sx={{
                                    borderRadius: '10px',
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    color: '#1A2332',
                                    borderColor: '#E2E8F0',
                                    '&:hover': {
                                        borderColor: '#1A6B9D',
                                        backgroundColor: 'rgba(26, 107, 157, 0.04)',
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            {user.status !== 'LOCKED' ? (
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<BlockIcon />}
                                    onClick={() => handleBlockClick('block')}
                                    sx={{
                                        borderRadius: '10px',
                                        px: 3,
                                        py: 1,
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        backgroundColor: '#EF4444',
                                        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
                                        '&:hover': {
                                            backgroundColor: '#DC2626',
                                        },
                                    }}
                                >
                                    Block Account
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<LockOpenIcon />}
                                    onClick={() => handleBlockClick('unblock')}
                                    sx={{
                                        borderRadius: '10px',
                                        px: 3,
                                        py: 1,
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        backgroundColor: '#10B981',
                                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                                        '&:hover': {
                                            backgroundColor: '#059669',
                                        },
                                    }}
                                >
                                    Unblock Account
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                open={actionDialogOpen}
                onClose={() => setActionDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        p: 1,
                        boxShadow: '0 20px 25px -5px rgba(10, 53, 87, 0.15)',
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A2332', pt: 2, pb: 1 }}>
                    {actionType === 'block' ? '🚫 Block User' : '🔓 Unblock User'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#8B92A1', mb: 2 }}>
                        Please state the reason below. This decision will be permanently logged into the audit trail.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label={`${actionType === 'block' ? 'Block' : 'Unblock'} Reason`}
                        placeholder={`Enter reason for ${actionType === 'block' ? 'blocking' : 'unblocking'} this user...`}
                        value={actionType === 'block' ? blockReason : unblockReason}
                        onChange={(e) =>
                            actionType === 'block' ? setBlockReason(e.target.value) : setUnblockReason(e.target.value)
                        }
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '&.Mui-focused fieldset': {
                                    borderColor: '#0F4C75',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#0F4C75',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
                    <Button
                        onClick={() => setActionDialogOpen(false)}
                        sx={{ color: '#8B92A1', fontWeight: 600, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color={actionType === 'block' ? 'error' : 'success'}
                        onClick={handleConfirmAction}
                        disabled={actionType === 'block' ? !blockReason.trim() : !unblockReason.trim()}
                        sx={{
                            borderRadius: '10px',
                            px: 3,
                            fontWeight: 700,
                            textTransform: 'none',
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};