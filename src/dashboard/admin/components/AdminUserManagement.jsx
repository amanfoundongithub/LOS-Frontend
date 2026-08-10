import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TablePagination,
  Grid,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useIsDeviceMobile } from '../../../utils/device.util';
import { UserDetailsDialog } from './UserDetailsDialog';
import UserStatusChip from '../../../components/UserStatusChip';
import { searchAllUsers } from '../http/admin.search-users';
import { getAllUserRoles } from '../http/user.all-roles';
import { getAllUserStatus } from '../http/user.all-status';
import {
  ALL_VALUES_KEY,
  convertToKeyAndValue,
  SORT_BY_LIST,
  SORT_BY_MAP,
  SORT_DIRECTION_LIST,
  SORT_DIRECTION_MAP
} from '../../../maps/sort-helper.map';
import SelectDropDown from '../../../components/input/SelectDropDown';
import InputField from '../../../components/input/InputTextField';

export const AdminUserManagementComponent = () => {
  // Controller variables
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /**
   * Search queries for searching users
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  /**
   * Sorting & Pagination states
   */
  const [sortBy, setSortBy] = useState(SORT_BY_MAP.CREATED_DATE);
  const [sortDir, setSortDir] = useState(SORT_DIRECTION_MAP.ASCENDING);
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
      });
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
      });
  }, []);

  // Search handler
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
      payload['role'] = selectedRole;
    }
    if (selectedStatus !== ALL_VALUES_KEY) {
      payload['status'] = selectedStatus;
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
  }, [debouncedSearchQuery, sortBy, sortDir, selectedRole, selectedStatus, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(0);
  };

  const isMobile = useIsDeviceMobile();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Dashboard Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 76, 117, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <PeopleAltIcon sx={{ color: '#0F4C75', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#1A2332', fontSize: '1.25rem', letterSpacing: '-0.01em' }}
          >
            User Management Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B92A1', fontSize: '0.85rem' }}>
            Filter, search, and manage registered system accounts and permissions
          </Typography>
        </Box>
      </Box>

      {/* Filter Toolbar Card */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 20px -5px rgba(10, 53, 87, 0.04)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
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
      </Paper>

      {/* Table / Empty State Content */}
      {users.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px -10px rgba(10, 53, 87, 0.05)'
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              backgroundColor: 'rgba(15, 76, 117, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <SearchOffIcon sx={{ fontSize: 36, color: '#0F4C75' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2332', mb: 0.5 }}>
            No Users Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B92A1', maxWidth: 360 }}>
            No user records matched your search parameters. Try adjusting your search query or clear applied filters.
          </Typography>
        </Card>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 10px 30px -10px rgba(10, 53, 87, 0.05)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 2,
                      borderBottom: '1px solid #E2E8F0'
                    }}
                  >
                    User Profile
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 2,
                      borderBottom: '1px solid #E2E8F0',
                      display: isMobile ? 'none' : 'table-cell'
                    }}
                  >
                    Email Address
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 2,
                      borderBottom: '1px solid #E2E8F0',
                      display: isMobile ? 'none' : 'table-cell'
                    }}
                  >
                    Created Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 2,
                      borderBottom: '1px solid #E2E8F0',
                      display: isMobile ? 'none' : 'table-cell'
                    }}
                  >
                    Last Login
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 2,
                      borderBottom: '1px solid #E2E8F0'
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 2,
                      borderBottom: '1px solid #E2E8F0'
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow
                    key={userItem.id}
                    sx={{
                      transition: 'background-color 0.15s ease',
                      borderBottom: '1px solid #F1F5F9',
                      '&:hover': {
                        backgroundColor: 'rgba(15, 76, 117, 0.02)'
                      },
                      '&:last-child td': {
                        borderBottom: 'none'
                      }
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          cursor: 'pointer',
                          '&:hover .user-name': { color: '#0F4C75' }
                        }}
                        onClick={() => handleUserClick(userItem)}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            backgroundColor: 'rgba(15, 76, 117, 0.1)',
                            color: '#0F4C75',
                            fontSize: '0.875rem',
                            fontWeight: 700
                          }}
                        >
                          {userItem.username ? userItem.username.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
                        </Avatar>
                        <Typography
                          className="user-name"
                          sx={{
                            fontWeight: 700,
                            color: '#1A2332',
                            fontSize: '0.875rem',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {userItem.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: isMobile ? 'none' : 'table-cell',
                        fontSize: '0.85rem',
                        color: '#64748B',
                        py: 2
                      }}
                    >
                      {userItem.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        display: isMobile ? 'none' : 'table-cell',
                        fontSize: '0.85rem',
                        color: '#64748B',
                        py: 2
                      }}
                    >
                      {userItem.createdDate ? new Date(userItem.createdDate).toLocaleDateString() : '---'}
                    </TableCell>
                    <TableCell
                      sx={{
                        display: isMobile ? 'none' : 'table-cell',
                        fontSize: '0.85rem',
                        color: '#64748B',
                        py: 2
                      }}
                    >
                      {userItem.lastLoginDate != null
                        ? new Date(userItem.lastLoginDate).toLocaleDateString()
                        : '---'}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={userItem.attributes?.userRole || 'N/A'}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(15, 76, 117, 0.08)',
                          color: '#0F4C75',
                          borderRadius: '6px',
                          border: '1px solid rgba(15, 76, 117, 0.12)'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
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
            sx={{
              borderTop: '1px solid #E2E8F0',
              color: '#64748B',
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontSize: '0.825rem',
                fontWeight: 600
              }
            }}
          />
        </Paper>
      )}

      <UserDetailsDialog
        open={userDetailsOpen}
        setOpen={setUserDetailsOpen}
        user={selectedUser}
        users={users}
        setUsers={setUsers}
      />
    </Box>
  );
};