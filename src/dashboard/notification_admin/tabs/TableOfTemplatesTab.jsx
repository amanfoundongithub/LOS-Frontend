import React, { useState } from 'react';
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
    IconButton
} from '@mui/material';
import {
    NOTIFICATION_TEMPLATE_CREATE_PERMISSION,
    NOTIFICATION_TEMPLATE_READ_PERMISSION,
    NOTIFICATION_TEMPLATE_UPDATE_PERMISSION,
    NOTIFICATION_TEMPLATE_DELETE_PERMISSION
} from '../../../constants/notification_admin.permissions';
import { useIsDeviceMobile } from '../../../utils/device.util';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailIcon from '@mui/icons-material/Mail';
import { createNotificationTemplate } from '../../../shared/notification_admin/template.create';
import { updateNotificationTemplate } from '../../../shared/notification_admin/template.update';
import { TemplateCreateDialog } from '../dialog/TemplateCreateDialog';
import { TemplateUpdateDialog } from '../dialog/TemplateUpdateDialog';
import { TemplateViewDialog } from '../dialog/TemplateViewDialog';


export const TableOfTemplatesTab = ({
    templates,
    setTemplates,
    setError,
    addAuditLog,
    checkPermission
}) => {

    const isMobile = useIsDeviceMobile();
    const [templateCreate, setTemplateCreate] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState(-1);
    const [templateToView, setTemplateToView] = useState(-1);
    const [editingTemplate, setEditingTemplate] = useState(null);

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
            })
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
                    addAuditLog("UPDATE_TEMPLATE", "POST /api/v1/template", "FAILED");
                }
            })
            .catch((err) => {
                console.log(err);
            })

    };

    const handleDeleteTemplate = (code) => {
        setTemplates(templates.filter((t) => t.code !== code));
        addAuditLog('Delete Template', `/api/v1/notifications/templates/${code}`, 'success');
    };

    const openCreateTemplateModal = () => {
        setEditingTemplate(null);
        setTemplateCreate(true);
    };
    const openViewTemplateModal = (index) => {
        setTemplateToView(index);
    };
    const openUpdateTemplateModal = (index) => {
        setEditingTemplate(templates[index]);
        setTemplateToEdit(index);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 2 : 0,
                }}
            >
                <Typography variant="h5">📧 Active Email Template(s)</Typography>
                {
                    checkPermission(NOTIFICATION_TEMPLATE_CREATE_PERMISSION)
                    &&
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openCreateTemplateModal}
                        fullWidth={isMobile}
                    >
                        Create Template
                    </Button>
                }
            </Box>

            {
                templates.length === 0 ?
                    <Card sx={{ p: 4, textAlign: 'center' }}>
                        <MailIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
                        <Typography color="textSecondary">
                            No template(s) found. Start by creating one!
                        </Typography>
                    </Card>
                    :
                    <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Template Code
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, display: isMobile ? 'none' : 'table-cell' }}>
                                        Subject Line
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="center">
                                        Modification Action(s)
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {templates.map(
                                    (template, index) => (
                                        <TableRow key={template.templateCode} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f2534', fontWeight: 600 }}>
                                                {template.templateCode}
                                            </TableCell>
                                            <TableCell sx={{ display: isMobile ? 'none' : 'table-cell', fontSize: '0.9rem', color: '#2b9953' }}>
                                                {template.subjectLine}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 0.5,
                                                        justifyContent: 'center',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    {checkPermission(NOTIFICATION_TEMPLATE_READ_PERMISSION)
                                                        &&
                                                        <IconButton
                                                            size="small"
                                                            title="View"
                                                            onClick={() => openViewTemplateModal(index)}
                                                            sx={{
                                                                color: '#2f10b9',
                                                                '&:hover': { backgroundColor: 'rgba(119, 121, 190, 0.87)' },
                                                            }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                    {checkPermission(NOTIFICATION_TEMPLATE_UPDATE_PERMISSION)
                                                        &&
                                                        <IconButton
                                                            size="small"
                                                            title="Edit"
                                                            onClick={() => openUpdateTemplateModal(index)}
                                                            sx={{
                                                                color: '#bb1982',
                                                                '&:hover': { backgroundColor: 'rgba(178, 19, 226, 0.1)' },
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                    {checkPermission(NOTIFICATION_TEMPLATE_DELETE_PERMISSION)
                                                        &&
                                                        <IconButton
                                                            size="small"
                                                            title="Delete"
                                                            onClick={() => handleDeleteTemplate(template.templateCode)}
                                                            sx={{
                                                                color: '#EF4444',
                                                                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            }

            <TemplateCreateDialog
                open={templateCreate}
                onClose={() => {
                    setTemplateCreate(false);
                }}
                onSave={handleCreateTemplate}
                canCreate={checkPermission(NOTIFICATION_TEMPLATE_CREATE_PERMISSION)}
            />

            <TemplateUpdateDialog
                open={templateToEdit !== -1}
                onClose={() => {
                    setTemplateToEdit(-1)
                }}
                onSave={handleUpdateTemplate}
                canUpdate={checkPermission(NOTIFICATION_TEMPLATE_UPDATE_PERMISSION)}
                template={templates[templateToEdit]}
            />

            <TemplateViewDialog
                open={templateToView !== -1}
                onClose={() =>
                    setTemplateToView(-1)
                }
                template={templates[templateToView]} />
        </>
    )
}