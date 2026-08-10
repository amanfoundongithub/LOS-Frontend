import { Box,Typography,Card,Table,TableContainer,Paper,TableHead,TableRow,TableCell,TableBody,Chip,Button,TablePagination,Grid} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useIsDeviceMobile } from '../../../utils/device.util';
import { useState, useEffect } from 'react';
import { UserDetailsDialog } from './UserDetailsDialog';
import { blockUser } from '../http/admin.block-user';
import UserStatusChip from '../../../components/UserStatusChip';
import { searchAllUsers } from '../http/admin.search-users';
import { getAllUserRoles } from '../http/user.all-roles';
import { getAllUserStatus } from '../http/user.all-status'
import { ALL_VALUES_KEY, convertToKeyAndValue, SORT_BY_LIST, SORT_BY_MAP, SORT_DIRECTION_LIST, SORT_DIRECTION_MAP } from '../../../maps/sort-helper.map';
import SelectDropDown from '../../../components/input/SelectDropDown';
import InputField from '../../../components/input/InputTextField';

export const AdminUserManagementComponent = () => {

    // Controller variables
    const [userDetailsOpen, setUserDetailsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    /**
     * Search queries for searching the users. This is a fun part
     * since all control variables are here in a single page.
     */
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    /**
     * sortBy -> sort by which field?
     * sortDir -> sorting direction?
     */
    const [sortBy, setSortBy] = useState(SORT_BY_MAP.CREATED_DATE);
    const [sortDir, setSortDir] = useState(SORT_DIRECTION_MAP.ASCENDING);

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleUserClick = (selectedUser) => {
        setSelectedUser(selectedUser);
        setUserDetailsOpen(true);
    };

    // User Roles List
    const [userRolesList, setUserRolesList] = useState([]);
    const [selectedRole, setSelectedRole] = useState(ALL_VALUES_KEY);
    useEffect(() => {
        getAllUserRoles()
            .then((res) => {
                setUserRolesList(convertToKeyAndValue(res));
            })
            .catch((err) => {
                console.log(`Error in fetching all user roles: ${err}`);
                setUserRolesList([]);
            })
    }, []);

    // User Statuses List
    const [useStatusList, setUserStatusList] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(ALL_VALUES_KEY);
    useEffect(() => {
        getAllUserStatus()
            .then((res) => {
                setUserStatusList(convertToKeyAndValue(res));
            })
            .catch((err) => {
                console.log(`Error in fetching all user statuses: ${err}`);
                setUserStatusList([]);
            })
    }, []);

    // useEffect handler to handle search functionality whenever params changes
    const [users, setUsers] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    useEffect(() => {
        const payload = {
            q: debouncedSearchQuery,
            page: page,
            size: rowsPerPage,
            sortBy: sortBy,
            sortDir: sortDir
        };
        if (selectedRole !== ALL_VALUES_KEY) {
            payload["role"] = selectedRole;
        }
        if (selectedStatus !== ALL_VALUES_KEY) {
            payload["status"] = selectedStatus;
        }
        searchAllUsers(payload)
            .then((res) => {
                setUsers(res);
                setTotalElements(res.length);
            })
            .catch((err) => {
                console.log(`Error while searching for users: ${err}`);
                setUsers([]);
                setTotalElements(0);
            });
    },
    [debouncedSearchQuery, sortBy, sortDir, selectedRole, selectedStatus, page, rowsPerPage]);


    const handleBlockUser = (userId, reason) => {
        blockUser({ reason, userId })
            .then(() => {
                setUsers(users.map((u) => u.id === userId ? { ...u, status: 'BLOCKED' } : u));
                alert(`User blocked with reason: ${reason}`);
            })
            .catch((err) => console.error(err));
    };

    const handleUnblockUser = (userId, reason) => {
        setUsers(users.map((u) => u.id === userId ? { ...u, status: 'ACTIVE' } : u));
        alert(`User unblocked with reason: ${reason}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(0); // Reset to first page when filter/sort criteria change
    };

    const isMobile = useIsDeviceMobile();

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    User Management Dashboard
                </Typography>

                <Grid container spacing={2} sx={{ mb: 1 }}>
                    <Grid item xs={12} md={4}>
                        <InputField
                            inputVariable={searchQuery}
                            handleInputChange={handleFilterChange(setSearchQuery)}
                            placeHolder="Search by username or email..."
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <SelectDropDown
                            label="Role"
                            listOfItems={userRolesList}
                            selectedItemValue={selectedRole}
                            selectionHandler={handleFilterChange(setSelectedRole)}
                            isAllNeeded={true}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <SelectDropDown
                            label="Status"
                            listOfItems={useStatusList}
                            selectedItemValue={selectedStatus}
                            selectionHandler={handleFilterChange(setSelectedStatus)}
                            isAllNeeded={true}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <SelectDropDown
                            label="Order"
                            listOfItems={SORT_DIRECTION_LIST}
                            selectedItemValue={sortDir}
                            selectionHandler={handleFilterChange(setSortDir)}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <SelectDropDown
                            label="Sort By"
                            listOfItems={SORT_BY_LIST}
                            selectedItemValue={sortBy}
                            selectionHandler={handleFilterChange(setSortBy)}
                        />
                    </Grid>
                </Grid>

            </Box>

            {users.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
                    <Typography color="textSecondary">
                        No users found matching your criteria. Please try again.
                    </Typography>
                </Card>
            ) : (
                <Paper sx={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                                    <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Created Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>Last Login Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((userItem) => (
                                    <TableRow key={userItem.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                                        <TableCell
                                            sx={{ fontWeight: 700, color: '#1A1A2E', cursor: 'pointer', '&:hover': { color: '#D4AF37' } }}
                                            onClick={() => handleUserClick(userItem)}
                                        >
                                            {userItem["username"]}
                                        </TableCell>
                                        <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                                            {userItem.email}
                                        </TableCell>
                                        <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                                            {userItem.createdDate ? new Date(userItem.createdDate).toLocaleDateString() : "---"}
                                        </TableCell>
                                        <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#6B7280' }}>
                                            {userItem.lastLoginDate != null ? new Date(userItem.lastLoginDate).toLocaleDateString() : "---"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                sx={{ fontFamily: 'monospace' }}
                                                label={userItem.attributes?.userRole || 'N/A'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <UserStatusChip userStatus={userItem.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}

            <UserDetailsDialog
                open={userDetailsOpen}
                onClose={() => setUserDetailsOpen(false)}
                user={selectedUser}
                onBlock={handleBlockUser}
                onUnblock={handleUnblockUser}
            />
        </>
    );
};