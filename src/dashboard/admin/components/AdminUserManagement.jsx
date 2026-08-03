import { Box, Typography, TextField, InputAdornment, Card, Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { useIsDeviceMobile } from '../../../utils/device.util';
import { useState } from 'react';
import { UserDetailsDialog } from './UserDetailsDialog';

export const AdminUserManagementComponent = ({
    users,
    setUsers
}) => {
    const isMobile = useIsDeviceMobile();
    const [searchQuery, setSearchQuery] = useState("");
    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [userDetailsOpen, setUserDetailsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const handleUserClick = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUserDetailsOpen(true);
  };
  const handleBlockUser = (userId, reason) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: 'BLOCKED' } : u
      )
    );
    alert(`User blocked with reason: ${reason}`);
  };

  const handleUnblockUser = (userId, reason) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: 'ACTIVE' } : u
      )
    );
    alert(`User unblocked with reason: ${reason}`);
  };
    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    👥 User Management
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />
            </Box>

            {filteredUsers.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
                    <Typography color="textSecondary">No users found</Typography>
                </Card>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Created Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Last Login Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }} align="center">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((userItem) => (
                                <TableRow key={userItem.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            color: '#1A1A2E',
                                            cursor: 'pointer',
                                            '&:hover': { color: '#D4AF37' },
                                        }}
                                        onClick={() => handleUserClick(userItem)}
                                    >
                                        {userItem.username}
                                    </TableCell>
                                    <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                                        {userItem.email}
                                    </TableCell>
                                    <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                                        {new Date(userItem.createdDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                                        {userItem.lastLoginDate != null? new Date(userItem.lastLoginDate).toLocaleDateString(): "---"}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                        sx = {{
                                            fontFamily : 'monospace'
                                        }}
                                        label={userItem.attributes.userRole}
                                        size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={userItem.status === 'ACTIVE' ? <CheckCircleIcon /> : <BlockIcon />}
                                            label={userItem.status}
                                            color={userItem.status === 'ACTIVE' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ display: isMobile ? 'none' : 'table-cell' }} align="center">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleUserClick(userItem)}
                                            sx={{
                                                borderColor: '#D4AF37',
                                                color: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#1A1A2E',
                                                    backgroundColor: '#1A1A2E',
                                                    color: '#D4AF37',
                                                },
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <UserDetailsDialog
                      open={userDetailsOpen}
                      onClose={() => setUserDetailsOpen(false)}
                      user={selectedUser}
                      onBlock={handleBlockUser}
                      onUnblock={handleUnblockUser}
                    />
        </>
    )
}