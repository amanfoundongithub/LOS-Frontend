import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TextField,
    InputAdornment,
    TablePagination,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
    alpha
} from '@mui/material';
import {
    NOTIFICATION_TEMPLATE_CREATE_PERMISSION,
    NOTIFICATION_TEMPLATE_READ_PERMISSION,
    NOTIFICATION_TEMPLATE_UPDATE_PERMISSION,
    NOTIFICATION_TEMPLATE_DELETE_PERMISSION
} from '../../../constants/notification_admin.permissions';
import { useIsDeviceMobile } from '../../../utils/device.util';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { createNotificationTemplate } from '../../../shared/notification_admin/template.create';
import { updateNotificationTemplate } from '../../../shared/notification_admin/template.update';
import { deleteNotificationTemplate } from '../../../shared/notification_admin/template.delete';
import { TemplateCreateDialog } from '../dialog/TemplateCreateDialog';
import { TemplateUpdateDialog } from '../dialog/TemplateUpdateDialog';
import { TemplateViewDialog } from '../dialog/TemplateViewDialog';
import { findAllNotificationTemplate } from '../../../shared/notification_admin/template.find';

export const TableOfTemplatesTab = ({
    user,
    setError,
    addAuditLog
}) => {
    const isMobile = useIsDeviceMobile();

    const checkPermission = (permission) => {
    if (!user?.attributes) return false;
    const permissions = user.attributes;
    return Object.keys(permissions).includes(permission);
  };

    // All email templates as a list
    const [templates, setTemplates] = useState([]);
    useEffect(() => {
        findAllNotificationTemplate()
            .then((allTemplates) => {
                setTemplates(allTemplates);
            })
            .catch((err) => {
                console.log(`Error while fetching templates from service: ${err}`);
            })
    });

    // Filter all the templates when search is needed
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const filteredTemplates = useMemo(() => {
        if (!searchQuery.trim()) return templates;
        const query = searchQuery.toLowerCase();
        return templates.filter(
            (t) =>
                t.templateCode?.toLowerCase().includes(query) ||
                t.subjectLine?.toLowerCase().includes(query)
        );
    }, [templates, searchQuery]);

    // Handle Pagination Change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(0);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setPage(0);
    };

    
    // Modal & State Management
    const [templateCreate, setTemplateCreate] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState(-1);
    const [templateToView, setTemplateToView] = useState(-1);
    const [editingTemplate, setEditingTemplate] = useState(null);

    // Delete Confirmation State
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        templateCode: null,
    });


    const handleCreateTemplate = (formData) => {
        if (templates.some((t) => t.templateCode === formData.templateCode)) {
            setError('Template with this code already exists. Please try another name.');
            return;
        }
        createNotificationTemplate(formData)
            .then((res) => {
                if (res != null) {
                    setTemplates([...templates, res]);
                    setError("");
                    addAuditLog("CREATE_TEMPLATE", "POST /api/v1/template", "SUCCESS");
                    setTemplateCreate(false);
                } else {
                    setError("Error during creation of template");
                    addAuditLog("CREATE_TEMPLATE", "POST /api/v1/template", "FAILED");
                }
            })
            .catch((err) => {
                console.log(err);
                addAuditLog("CREATE_TEMPLATE", "POST /api/v1/template", "FAILED");
            });
    };

    const handleUpdateTemplate = (formData) => {
        updateNotificationTemplate(formData)
            .then((res) => {
                if (res != null) {
                    setTemplates(templates.map((t) => (t.templateCode === editingTemplate.templateCode ? res : t)));
                    setEditingTemplate(null);
                    addAuditLog('UPDATE_TEMPLATE', `PATCH /api/v1/template`, 'SUCCESS');
                    setTemplateToEdit(-1);
                } else {
                    setError("Error during updation of template");
                    addAuditLog("UPDATE_TEMPLATE", "PATCH /api/v1/template", "FAILED");
                }
            })
            .catch((err) => {
                console.log(err);
                addAuditLog("UPDATE_TEMPLATE", "PATCH /api/v1/template", "FAILED");
            });
    };

    // Open Delete Confirmation Dialog
    const openDeleteConfirmation = (templateCode) => {
        setDeleteConfirmation({
            open: true,
            templateCode,
        });
    };

    // Close Delete Confirmation Dialog
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            open: false,
            templateCode: null,
        });
    };

    // Confirm and Execute Deletion
    const handleConfirmDelete = () => {
        const { templateCode } = deleteConfirmation;
        if (!templateCode) return;

        deleteNotificationTemplate(templateCode)
            .then(() => {
                setTemplates(templates.filter((t) => t.templateCode !== templateCode));
                addAuditLog('DELETE_TEMPLATE', `DELETE /api/v1/template?templateCode=${templateCode}`, 'SUCCESS');
            })
            .catch((err) => {
                console.log(err);
                addAuditLog('DELETE_TEMPLATE', `DELETE /api/v1/template?templateCode=${templateCode}`, 'FAILED');
            })
            .finally(() => {
                closeDeleteConfirmation();
            });
    };

    const openCreateTemplateModal = () => {
        setEditingTemplate(null);
        setTemplateCreate(true);
    };

    const openViewTemplateModal = (templateCode) => {
        const index = templates.findIndex((t) => t.templateCode === templateCode);
        setTemplateToView(index);
    };

    const openUpdateTemplateModal = (templateCode) => {
        const index = templates.findIndex((t) => t.templateCode === templateCode);
        setEditingTemplate(templates[index]);
        setTemplateToEdit(index);
    };

    return (
        <>
            {/* Header & Controls Area */}
            <Box
    sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        mb: 3.5,
        pb: isMobile ? 0 : 1,
        gap: 2.5,
    }}
>
    {/* Left: Icon Badge + Title + Subtitle */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
            sx={{
                width: { xs: 44, sm: 48 },
                height: { xs: 44, sm: 48 },
                borderRadius: '14px',
                bgcolor: 'primary.50',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'primary.100',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.08)',
                flexShrink: 0,
            }}
        >
            <EmailRoundedIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
        </Box>

        <Box>
            <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap">
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        letterSpacing: '-0.02em',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                >
                    Active Email Templates
                </Typography>

                <Chip
                    label="Live"
                    size="small"
                    sx={{
                        height: 20,
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        bgcolor: 'success.50',
                        color: 'success.dark',
                        border: '1px solid',
                        borderColor: 'success.200',
                        '& .MuiChip-label': { px: 1 },
                    }}
                />
            </Stack>

            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    fontWeight: 400,
                    mt: 0.25,
                }}
            >
                Search, inspect, and update system notification templates.
            </Typography>
        </Box>
    </Box>

    {/* Right: Search Input + Action Button */}
    <Box
        sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 1.5,
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto',
        }}
    >
        {/* Search Field */}
        <TextField
            size="small"
            placeholder="Search code or subject..."
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth={isMobile}
            sx={{
                minWidth: isMobile ? '100%' : 290,
                '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s ease-in-out',
                    '& fieldset': {
                        borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                        borderColor: 'primary.main',
                    },
                    '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                    },
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                ),
                endAdornment: searchQuery && (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch} edge="end">
                            <ClearIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />

        {/* Create Button */}
        {checkPermission(NOTIFICATION_TEMPLATE_CREATE_PERMISSION) && (
            <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={openCreateTemplateModal}
                fullWidth={isMobile}
                sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 2.5,
                    py: 1,
                    whiteSpace: 'nowrap',
                    background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 18px rgba(25, 118, 210, 0.35)',
                    },
                }}
            >
                Create Template
            </Button>
        )}
    </Box>
</Box>

            {templates.length === 0 ? (
                <Card
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: '16px',
                        border: '1px dashed',
                        borderColor: 'divider',
                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5),
                    }}
                >
                    <MailIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2, opacity: 0.8 }} />
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
                        No Templates Found
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        Get started by creating your first email notification template.
                    </Typography>
                </Card>
            ) : filteredTemplates.length === 0 ? (
                <Card
                    elevation={0}
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                    }}
                >
                    <SearchOffIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                        No matching results
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                        No templates match your search "{searchQuery}".
                    </Typography>
                    <Button variant="outlined" size="small" onClick={handleClearSearch} sx={{ borderRadius: '8px' }}>
                        Clear Search
                    </Button>
                </Card>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#FAFAFA' }}>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2 }}>
                                        Template Code
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            color: 'text.secondary',
                                            py: 2,
                                            display: isMobile ? 'none' : 'table-cell',
                                        }}
                                    >
                                        Subject Line
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2 }} align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTemplates
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((template) => (
                                        <TableRow
                                            key={template.templateCode}
                                            sx={{
                                                transition: 'background-color 0.2s',
                                                '&:hover': { backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.02) },
                                            }}
                                        >
                                            <TableCell sx={{ py: 2 }}>
                                                <Chip
                                                    label={template.templateCode}
                                                    size="small"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        fontWeight: 600,
                                                        borderRadius: '6px',
                                                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                                        color: 'primary.main',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    py: 2,
                                                    display: isMobile ? 'none' : 'table-cell',
                                                    fontSize: '0.9rem',
                                                    color: 'text.primary',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {template.subjectLine}
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        gap: 0.5,
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {checkPermission(NOTIFICATION_TEMPLATE_READ_PERMISSION) && (
                                                        <Tooltip title="View Template">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => openViewTemplateModal(template.templateCode)}
                                                                sx={{
                                                                    color: 'primary.main',
                                                                    '&:hover': {
                                                                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                                                    },
                                                                }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {checkPermission(NOTIFICATION_TEMPLATE_UPDATE_PERMISSION) && (
                                                        <Tooltip title="Edit Template">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => openUpdateTemplateModal(template.templateCode)}
                                                                sx={{
                                                                    color: 'info.main',
                                                                    '&:hover': {
                                                                        backgroundColor: (theme) => alpha(theme.palette.info.main, 0.12),
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {checkPermission(NOTIFICATION_TEMPLATE_DELETE_PERMISSION) && (
                                                        <Tooltip title="Delete Template">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => openDeleteConfirmation(template.templateCode)}
                                                                sx={{
                                                                    color: 'error.main',
                                                                    '&:hover': {
                                                                        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.12),
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredTemplates.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                </Paper>
            )}

            {/* Delete Confirmation Popup */}
            <Dialog
                open={deleteConfirmation.open}
                onClose={closeDeleteConfirmation}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        p: 1,
                        maxWidth: 440,
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                        }}
                    >
                        <WarningAmberRoundedIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Delete Template
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText color="text.secondary">
                        Are you sure you want to delete the template{' '}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                fontFamily: 'monospace',
                            }}
                        >
                            "{deleteConfirmation.templateCode}"
                        </Box>
                        ? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={closeDeleteConfirmation}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        autoFocus
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Components */}
            <TemplateCreateDialog
                open={templateCreate}
                onClose={() => setTemplateCreate(false)}
                onSave={handleCreateTemplate}
                canCreate={checkPermission(NOTIFICATION_TEMPLATE_CREATE_PERMISSION)}
            />

            <TemplateUpdateDialog
                open={templateToEdit !== -1}
                onClose={() => setTemplateToEdit(-1)}
                onSave={handleUpdateTemplate}
                canUpdate={checkPermission(NOTIFICATION_TEMPLATE_UPDATE_PERMISSION)}
                template={templates[templateToEdit]}
            />

            <TemplateViewDialog
                open={templateToView !== -1}
                onClose={() => setTemplateToView(-1)}
                template={templates[templateToView]}
            />
        </>
    );
};