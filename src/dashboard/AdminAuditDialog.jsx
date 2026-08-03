import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Button,
    Typography,
    Box
} from '@mui/material'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HistoryIcon from '@mui/icons-material/History'

const listOfAuditFields = [
    "Time",
    "Action",
    "HTTP Reference",
    "Status"
];

export const AdminAuditLogDialog = ({
    open,
    onClose,
    logs
}) => {

    const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: 'short'
        })

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx: {
                    borderRadius: 3
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 2
                }}
            >
                <HistoryIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                    Recent API Audit Logs
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>

                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        maxHeight: 450
                    }}
                >
                    <Table stickyHeader size="small">

                        <TableHead>
                            <TableRow>
                                {listOfAuditFields.map((field) => (
                                    <TableCell
                                        key={field}
                                        sx={{
                                            fontWeight: 700,
                                            backgroundColor: "#F8FAFC",
                                            color: "text.secondary",
                                            letterSpacing: 0.4
                                        }}
                                    >
                                        {field}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                        sx={{ py: 5 }}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            No audit logs available.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            {logs.map((log, idx) => (

                                <TableRow
                                    key={idx}
                                    hover
                                    sx={{
                                        "&:nth-of-type(even)": {
                                            backgroundColor: "#FAFAFA"
                                        },
                                        transition: "0.2s"
                                    }}
                                >

                                    <TableCell
                                        sx={{
                                            fontSize: "0.82rem",
                                            whiteSpace: "nowrap",
                                            color: "text.secondary"
                                        }}
                                    >
                                        {formatTime(log.timestamp)}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 600
                                        }}
                                    >
                                        {log.action}
                                    </TableCell>

                                    <TableCell>
                                        <Box
                                            sx={{
                                                fontFamily: "monospace",
                                                bgcolor: "grey.100",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                display: "inline-block",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            {log.endpoint}
                                        </Box>
                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            size="small"
                                            variant="filled"
                                            color={
                                                log.status.toLowerCase() === "success"
                                                    ? "success"
                                                    : "error"
                                            }
                                            icon={
                                                log.status.toLowerCase() === "success"
                                                    ? <CheckCircleIcon />
                                                    : <ErrorIcon />
                                            }
                                            label={log.status}
                                        />

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>

            </DialogContent>

            <DialogActions
                sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    px: 3,
                    py: 2
                }}
            >
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>

        </Dialog>
    )
}