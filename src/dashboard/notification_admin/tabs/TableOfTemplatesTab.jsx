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

export const TableOfTemplatesTab = ({
    templatesList,
    checkPermission,
    openCreateTemplateModal,
    openViewTemplateModal,
    openUpdateTemplateModal,
    handleDeleteTemplate
}) => {
    const isMobile = useIsDeviceMobile();
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
            templatesList.length === 0 ? 
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
                        {templatesList.map(
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
        </>
    )
}