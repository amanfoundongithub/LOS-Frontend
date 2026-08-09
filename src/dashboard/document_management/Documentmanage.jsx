import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Pagination,
  InputAdornment,
  FormControl,
  Select,
  Stack,
  Divider,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  CheckCircle as VerifiedIcon,
  Warning as PendingIcon,
  Error as RejectedIcon,
  HelpOutline as MissingIcon,
  CloudUpload as UploadIcon,
  Timeline as TimelineIcon,
  Assignment as DocumentIcon,
  Dashboard as DashboardIcon,
  FilePresent as FileIcon,
  AssignmentTurnedIn as QueueIcon,
  Info as InfoIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectSmallIcon,
} from '@mui/icons-material';

// ============================================================================
// MOCK DATA
// ============================================================================

const generateMockDocuments = () => [
  {
    id: 'DOC001',
    name: 'Aadhaar.pdf',
    customer: 'Rahul Sharma',
    customerId: 'CUST001',
    applicationId: 'LN-10234',
    documentType: 'Identity',
    status: 'Verified',
    uploadedDate: '2026-08-08T10:32:00',
    uploadedBy: 'Customer',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    verifiedBy: 'Aman Kumar',
    verifiedDate: '2026-08-08T11:05:00',
  },
  {
    id: 'DOC002',
    name: 'SalarySlip.pdf',
    customer: 'Priya Kumar',
    customerId: 'CUST002',
    applicationId: 'LN-10241',
    documentType: 'Income',
    status: 'Pending',
    uploadedDate: '2026-08-08T09:45:00',
    uploadedBy: 'Customer',
    fileSize: '1.8 MB',
    fileType: 'PDF',
  },
  {
    id: 'DOC003',
    name: 'AddressProof.pdf',
    customer: 'Amit Rao',
    customerId: 'CUST003',
    applicationId: 'LN-10252',
    documentType: 'Address',
    status: 'Rejected',
    uploadedDate: '2026-08-07T14:20:00',
    uploadedBy: 'Customer',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    rejectionReason: 'Document is unclear',
    rejectedBy: 'Priya Singh',
    rejectedDate: '2026-08-07T15:10:00',
  },
  {
    id: 'DOC004',
    name: 'PAN.pdf',
    customer: 'Neha Gupta',
    customerId: 'CUST004',
    applicationId: 'LN-10263',
    documentType: 'Identity',
    status: 'Verified',
    uploadedDate: '2026-08-07T11:00:00',
    uploadedBy: 'Customer',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    verifiedBy: 'Aman Kumar',
    verifiedDate: '2026-08-07T11:45:00',
  },
  {
    id: 'DOC005',
    name: 'BankStatement.pdf',
    customer: 'Vikram Singh',
    customerId: 'CUST005',
    applicationId: 'LN-10272',
    documentType: 'Banking',
    status: 'Pending',
    uploadedDate: '2026-08-08T08:30:00',
    uploadedBy: 'Customer',
    fileSize: '2.7 MB',
    fileType: 'PDF',
  },
  {
    id: 'DOC006',
    name: 'EmploymentProof.pdf',
    customer: 'Ananya Patel',
    customerId: 'CUST006',
    applicationId: 'LN-10281',
    documentType: 'Employment',
    status: 'Pending',
    uploadedDate: '2026-08-08T07:15:00',
    uploadedBy: 'Customer',
    fileSize: '1.5 MB',
    fileType: 'PDF',
  },
  {
    id: 'DOC007',
    name: 'UtilityBill.pdf',
    customer: 'Rajesh Kumar',
    customerId: 'CUST007',
    applicationId: 'LN-10290',
    documentType: 'Address',
    status: 'Verified',
    uploadedDate: '2026-08-06T16:40:00',
    uploadedBy: 'Customer',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    verifiedBy: 'Priya Singh',
    verifiedDate: '2026-08-07T09:20:00',
  },
  {
    id: 'DOC008',
    name: 'Form16.pdf',
    customer: 'Meera Reddy',
    customerId: 'CUST008',
    applicationId: 'LN-10305',
    documentType: 'Income',
    status: 'Rejected',
    uploadedDate: '2026-08-07T13:25:00',
    uploadedBy: 'Customer',
    fileSize: '1.9 MB',
    fileType: 'PDF',
    rejectionReason: 'Information does not match',
    rejectedBy: 'Aman Kumar',
    rejectedDate: '2026-08-07T14:05:00',
  },
  {
    id: 'DOC009',
    name: 'DrivingLicense.pdf',
    customer: 'Arjun Desai',
    customerId: 'CUST009',
    applicationId: 'LN-10312',
    documentType: 'Identity',
    status: 'Verified',
    uploadedDate: '2026-08-06T12:10:00',
    uploadedBy: 'Customer',
    fileSize: '2.3 MB',
    fileType: 'PDF',
    verifiedBy: 'Priya Singh',
    verifiedDate: '2026-08-06T13:35:00',
  },
  {
    id: 'DOC010',
    name: 'CancelledCheque.pdf',
    customer: 'Divya Nair',
    customerId: 'CUST010',
    applicationId: 'LN-10320',
    documentType: 'Banking',
    status: 'Pending',
    uploadedDate: '2026-08-08T09:00:00',
    uploadedBy: 'Customer',
    fileSize: '0.8 MB',
    fileType: 'PDF',
  },
  {
    id: 'DOC011',
    name: 'TaxReturn.pdf',
    customer: 'Sanjay Mishra',
    customerId: 'CUST011',
    applicationId: 'LN-10331',
    documentType: 'Tax',
    status: 'Verified',
    uploadedDate: '2026-08-05T10:20:00',
    uploadedBy: 'Customer',
    fileSize: '3.2 MB',
    fileType: 'PDF',
    verifiedBy: 'Aman Kumar',
    verifiedDate: '2026-08-05T11:15:00',
  },
  {
    id: 'DOC012',
    name: 'OfferLetter.pdf',
    customer: 'Ishita Jain',
    customerId: 'CUST012',
    applicationId: 'LN-10342',
    documentType: 'Employment',
    status: 'Pending',
    uploadedDate: '2026-08-08T06:45:00',
    uploadedBy: 'Customer',
    fileSize: '1.4 MB',
    fileType: 'PDF',
  },
];

const generateAuditHistory = (docId) => [
  {
    id: 'AUD001',
    timestamp: '2026-08-08T10:32:00',
    action: 'Document uploaded',
    actor: 'Customer',
    actorName: 'Customer Portal',
  },
  {
    id: 'AUD002',
    timestamp: '2026-08-08T10:35:00',
    action: 'Document assigned for verification',
    actor: 'System',
    actorName: 'LOS System',
  },
  {
    id: 'AUD003',
    timestamp: '2026-08-08T11:02:00',
    action: 'Verification started',
    actor: 'Operator',
    actorName: 'Aman Kumar',
  },
  {
    id: 'AUD004',
    timestamp: '2026-08-08T11:05:00',
    action: 'Document verified',
    actor: 'Operator',
    actorName: 'Aman Kumar',
  },
];

const documentTypes = [
  'Identity',
  'Address',
  'Income',
  'Employment',
  'Banking',
  'Tax',
  'Collateral',
  'Other',
];

const rejectionReasons = [
  'Document is unclear',
  'Document is expired',
  'Incorrect document',
  'Information does not match',
  'Document is incomplete',
  'Suspected duplicate',
  'Other',
];

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const StatusChip = ({ status }) => {
  const statusConfig = {
    Verified: { color: 'success', icon: <VerifiedIcon sx={{ fontSize: 18 }} /> },
    Pending: { color: 'warning', icon: <PendingIcon sx={{ fontSize: 18 }} /> },
    Rejected: { color: 'error', icon: <RejectedIcon sx={{ fontSize: 18 }} /> },
    Missing: { color: 'default', icon: <MissingIcon sx={{ fontSize: 18 }} /> },
    'Re-upload Required': { color: 'warning', icon: <UploadIcon sx={{ fontSize: 18 }} /> },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <Chip
      icon={config.icon}
      label={status}
      color={config.color}
      variant="outlined"
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

const KPICard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, my: 1 }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {Icon && (
          <Box sx={{ color: 'primary.main', opacity: 0.7 }}>
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

// ============================================================================
// DASHBOARD PAGE
// ============================================================================

const DashboardPage = ({ documents }) => {
  const stats = useMemo(() => {
    const verified = documents.filter(d => d.status === 'Verified').length;
    const pending = documents.filter(d => d.status === 'Pending').length;
    const rejected = documents.filter(d => d.status === 'Rejected').length;
    const today = documents.filter(
      d => new Date(d.uploadedDate).toDateString() === new Date().toDateString()
    ).length;

    return {
      total: documents.length,
      pending,
      verified,
      rejected,
      today,
      missing: 18,
      reuploadRequired: 3,
      failedUploads: 1,
    };
  }, [documents]);

  const recentDocuments = documents.slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Dashboard
        </Typography>

        {/* Primary KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Documents"
              value={stats.total}
              icon={FileIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Pending Review"
              value={stats.pending}
              icon={PendingIcon}
              subtitle="Awaiting verification"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Verified"
              value={stats.verified}
              icon={VerifiedIcon}
              subtitle="Successfully verified"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Rejected"
              value={stats.rejected}
              icon={RejectedIcon}
              subtitle="Requires resubmission"
            />
          </Grid>
        </Grid>

        {/* Secondary KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <KPICard
              title="Uploaded Today"
              value={stats.today}
              icon={UploadIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KPICard
              title="Missing Documents"
              value={stats.missing}
              icon={MissingIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KPICard
              title="Re-upload Required"
              value={stats.reuploadRequired}
              icon={UploadIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KPICard
              title="Failed Uploads"
              value={stats.failedUploads}
              icon={InfoIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KPICard
              title="Avg. Verification Time"
              value="45 min"
              icon={TimelineIcon}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Recent Documents */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Documents
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Document Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Application</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Uploaded</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentDocuments.map(doc => (
                <TableRow key={doc.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                  <TableCell>{doc.customer}</TableCell>
                  <TableCell>{doc.applicationId}</TableCell>
                  <TableCell>
                    <StatusChip status={doc.status} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {new Date(doc.uploadedDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Verification Queue Summary
              </Typography>
            </Box>
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Documents waiting for review
                  </Typography>
                  <Chip label={stats.pending} color="warning" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Oldest pending (uploaded)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    2 hours ago
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
                  View Queue
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Missing Documents
              </Typography>
            </Box>
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Documents required but not submitted
                  </Typography>
                  <Chip label={stats.missing} variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Pending customer requests
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    12
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
                  View Missing
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// ============================================================================
// DOCUMENT REVIEW MODAL
// ============================================================================

const DocumentReviewModal = ({ open, document, onClose, onVerify, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionComment, setRejectionComment] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const auditHistory = useMemo(() => generateAuditHistory(document?.id), [document?.id]);

  const handleReject = () => {
    onReject({
      docId: document.id,
      reason: rejectionReason,
      comment: rejectionComment,
    });
    setShowRejectionForm(false);
    setRejectionReason('');
    setRejectionComment('');
  };

  if (!document) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Document Review
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Left: Document Preview */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Document Preview
              </Typography>
              <Paper
                sx={{
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                  borderRadius: 1,
                  position: 'relative',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <FileIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 1 }} />
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    PDF Preview
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button size="small" variant="outlined" startIcon={<SearchIcon />}>
                      Zoom In
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<RefreshIcon />}>
                      Rotate
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<FileDownloadIcon />}>
                      Full Screen
                    </Button>
                  </Stack>
                </Box>
              </Paper>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right: Document Information & Actions */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Document Information
              </Typography>

              <Stack spacing={2.5} sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Document Name
                  </Typography>
                  <Typography variant="body2">{document.name}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Document Type
                  </Typography>
                  <Chip label={document.documentType} size="small" variant="outlined" />
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Customer
                  </Typography>
                  <Typography variant="body2">{document.customer}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Customer ID
                  </Typography>
                  <Typography variant="body2">{document.customerId}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Application
                  </Typography>
                  <Typography variant="body2">{document.applicationId}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Uploaded Date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(document.uploadedDate).toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    File Size
                  </Typography>
                  <Typography variant="body2">{document.fileSize}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Current Status
                  </Typography>
                  <StatusChip status={document.status} />
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Verification Actions */}
              {document.status === 'Pending' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Verification Actions
                  </Typography>

                  {!showRejectionForm ? (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() => onVerify(document.id)}
                        fullWidth
                      >
                        Verify
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<RejectSmallIcon />}
                        onClick={() => setShowRejectionForm(true)}
                        fullWidth
                      >
                        Reject
                      </Button>
                    </Stack>
                  ) : (
                    <Box sx={{ backgroundColor: '#fff3cd', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Rejection Details
                      </Typography>

                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <Select
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">Select rejection reason...</MenuItem>
                          {rejectionReasons.map(reason => (
                            <MenuItem key={reason} value={reason}>
                              {reason}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        placeholder="Additional comment (optional)"
                        value={rejectionComment}
                        onChange={e => setRejectionComment(e.target.value)}
                        sx={{ mb: 2 }}
                      />

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={handleReject}
                          fullWidth
                          disabled={!rejectionReason}
                        >
                          Submit Rejection
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setShowRejectionForm(false);
                            setRejectionReason('');
                            setRejectionComment('');
                          }}
                          fullWidth
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Box>
              )}

              {document.status === 'Verified' && (
                <Box sx={{ backgroundColor: '#d4edda', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#155724' }}>
                    ✓ Verified
                  </Typography>
                  <Stack spacing={1} sx={{ color: '#155724' }}>
                    <Typography variant="caption">
                      <strong>Verified by:</strong> {document.verifiedBy}
                    </Typography>
                    <Typography variant="caption">
                      <strong>Date:</strong> {new Date(document.verifiedDate).toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>
              )}

              {document.status === 'Rejected' && (
                <Box sx={{ backgroundColor: '#f8d7da', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#721c24' }}>
                    ✕ Rejected
                  </Typography>
                  <Stack spacing={1} sx={{ color: '#721c24' }}>
                    <Typography variant="caption">
                      <strong>Reason:</strong> {document.rejectionReason}
                    </Typography>
                    <Typography variant="caption">
                      <strong>Rejected by:</strong> {document.rejectedBy}
                    </Typography>
                    <Typography variant="caption">
                      <strong>Date:</strong> {new Date(document.rejectedDate).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    startIcon={<UploadIcon />}
                  >
                    Re-upload Required
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Audit Timeline */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Audit History
          </Typography>
          <Timeline position="alternate">
            {auditHistory.map((event, idx) => (
              <TimelineItem key={event.id}>
                <TimelineOppositeContent color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                  {new Date(event.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      backgroundColor:
                        event.actor === 'Operator' ? 'primary.main' : 'grey.300',
                    }}
                  />
                  {idx < auditHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ fontSize: '0.875rem' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {event.action}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    by {event.actorName}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// ALL DOCUMENTS PAGE
// ============================================================================

const AllDocumentsPage = ({ documents }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.applicationId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
      const matchesType = typeFilter === 'All' || doc.documentType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, searchTerm, statusFilter, typeFilter]);

  const paginatedDocuments = filteredDocuments.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleOpenReview = doc => {
    setSelectedDocument(doc);
    setReviewOpen(true);
  };

  const handleVerify = docId => {
    console.log('Verified:', docId);
    setReviewOpen(false);
  };

  const handleReject = data => {
    console.log('Rejected:', data);
    setReviewOpen(false);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setTypeFilter('All');
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        All Documents
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search documents..."
              size="small"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Verified">Verified</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Missing">Missing</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={typeFilter}
                onChange={e => {
                  setTypeFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All Types</MenuItem>
                {documentTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleReset}
                fullWidth
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<UploadIcon />}
              >
                Upload
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            Showing {paginatedDocuments.length === 0 ? 0 : page * rowsPerPage + 1} to{' '}
            {Math.min((page + 1) * rowsPerPage, filteredDocuments.length)} of{' '}
            {filteredDocuments.length} results
          </Typography>
          <FormControl size="small">
            <Select value={rowsPerPage} onChange={e => setRowsPerPage(e.target.value)}>
              <MenuItem value={5}>5 rows</MenuItem>
              <MenuItem value={10}>10 rows</MenuItem>
              <MenuItem value={25}>25 rows</MenuItem>
              <MenuItem value={50}>50 rows</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Documents Table */}
      {paginatedDocuments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <DocumentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography color="textSecondary" sx={{ mb: 1 }}>
            No documents found
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Document Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Application ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Uploaded</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDocuments.map(doc => (
                <TableRow key={doc.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                  <TableCell>{doc.customer}</TableCell>
                  <TableCell>{doc.applicationId}</TableCell>
                  <TableCell>
                    <Chip label={doc.documentType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={doc.status} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {new Date(doc.uploadedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenReview(doc)}
                        title="Review"
                      >
                        <ViewIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" title="Download">
                        <DownloadIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {filteredDocuments.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredDocuments.length / rowsPerPage)}
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
          />
        </Box>
      )}

      {/* Review Modal */}
      <DocumentReviewModal
        open={reviewOpen}
        document={selectedDocument}
        onClose={() => setReviewOpen(false)}
        onVerify={handleVerify}
        onReject={handleReject}
      />
    </Box>
  );
};

// ============================================================================
// MISSING DOCUMENTS PAGE
// ============================================================================

const MissingDocumentsPage = () => {
  const missingDocuments = [
    {
      id: 'REQ001',
      applicationId: 'LN-10234',
      customer: 'Rahul Sharma',
      documentType: 'Address Proof',
      status: 'Missing',
      requiredDate: '2026-08-06',
      lastReminder: '2026-08-08T09:30:00',
    },
    {
      id: 'REQ002',
      applicationId: 'LN-10234',
      customer: 'Rahul Sharma',
      documentType: 'Employment Proof',
      status: 'Missing',
      requiredDate: '2026-08-06',
      lastReminder: null,
    },
    {
      id: 'REQ003',
      applicationId: 'LN-10241',
      customer: 'Priya Kumar',
      documentType: 'Address Proof',
      status: 'Missing',
      requiredDate: '2026-08-07',
      lastReminder: '2026-08-08T08:00:00',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Missing Documents
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <InfoIcon sx={{ mr: 1, fontSize: 18 }} />
        Showing documents that are required but not yet submitted by customers.
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Application</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Document Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Required Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Last Reminder</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {missingDocuments.map(doc => (
              <TableRow key={doc.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                <TableCell sx={{ fontWeight: 600 }}>{doc.applicationId}</TableCell>
                <TableCell>{doc.customer}</TableCell>
                <TableCell>{doc.documentType}</TableCell>
                <TableCell>
                  <Chip label="Missing" color="warning" variant="outlined" size="small" />
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>
                  {new Date(doc.requiredDate).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {doc.lastReminder
                    ? new Date(doc.lastReminder).toLocaleString()
                    : 'No reminder sent'}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" variant="outlined">
                      Send Request
                    </Button>
                    <Button size="small" variant="text">
                      View Application
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// ============================================================================
// VERIFICATION QUEUE PAGE
// ============================================================================

const VerificationQueuePage = ({ documents }) => {
  const queueDocuments = useMemo(
    () =>
      documents
        .filter(d => d.status === 'Pending')
        .sort(
          (a, b) =>
            new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime()
        ),
    [documents]
  );

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const handleOpenReview = doc => {
    setSelectedDoc(doc);
    setReviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Verification Queue
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                Pending Verification
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {queueDocuments.length}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Awaiting operator review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                Oldest Pending
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {queueDocuments.length > 0
                  ? `${Math.floor(
                      (new Date() - new Date(queueDocuments[0].uploadedDate)) / 3600000
                    )}h ago`
                  : 'N/A'}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Document in queue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                Avg. Verification Time
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                45 min
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {queueDocuments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography color="textSecondary" sx={{ mb: 1 }}>
            No documents pending verification
          </Typography>
          <Typography variant="caption" color="textSecondary">
            All documents have been reviewed
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Document</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Application</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Uploaded Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Waiting Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queueDocuments.map(doc => {
                const waitingHours = Math.floor(
                  (new Date() - new Date(doc.uploadedDate)) / 3600000
                );
                return (
                  <TableRow key={doc.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                    <TableCell>{doc.customer}</TableCell>
                    <TableCell>{doc.applicationId}</TableCell>
                    <TableCell>
                      <Chip label={doc.documentType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {new Date(doc.uploadedDate).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${waitingHours} hours`}
                        color={waitingHours > 24 ? 'error' : 'warning'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ViewIcon />}
                        onClick={() => handleOpenReview(doc)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <DocumentReviewModal
        open={reviewOpen}
        document={selectedDoc}
        onClose={() => setReviewOpen(false)}
        onVerify={() => setReviewOpen(false)}
        onReject={() => setReviewOpen(false)}
      />
    </Box>
  );
};

// ============================================================================
// AUDIT HISTORY PAGE
// ============================================================================

const AuditHistoryPage = ({ documents }) => {
  const allAuditEvents = useMemo(() => {
    const events = [];
    documents.forEach(doc => {
      events.push(
        {
          id: `${doc.id}-upload`,
          timestamp: doc.uploadedDate,
          action: 'Document uploaded',
          actor: 'Customer',
          actorName: doc.uploadedBy,
          documentName: doc.name,
          applicationId: doc.applicationId,
        },
        {
          id: `${doc.id}-assign`,
          timestamp: new Date(new Date(doc.uploadedDate).getTime() + 3 * 60000),
          action: 'Document assigned for verification',
          actor: 'System',
          actorName: 'LOS System',
          documentName: doc.name,
          applicationId: doc.applicationId,
        }
      );

      if (doc.status === 'Verified') {
        events.push(
          {
            id: `${doc.id}-verify-start`,
            timestamp: new Date(new Date(doc.uploadedDate).getTime() + 30 * 60000),
            action: 'Verification started',
            actor: 'Operator',
            actorName: doc.verifiedBy || 'Operator',
            documentName: doc.name,
            applicationId: doc.applicationId,
          },
          {
            id: `${doc.id}-verified`,
            timestamp: doc.verifiedDate,
            action: 'Document verified',
            actor: 'Operator',
            actorName: doc.verifiedBy,
            documentName: doc.name,
            applicationId: doc.applicationId,
          }
        );
      }

      if (doc.status === 'Rejected') {
        events.push({
          id: `${doc.id}-rejected`,
          timestamp: doc.rejectedDate,
          action: 'Document rejected',
          actor: 'Operator',
          actorName: doc.rejectedBy,
          documentName: doc.name,
          applicationId: doc.applicationId,
          comment: doc.rejectionReason,
        });
      }
    });

    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [documents]);

  const [filterApplication, setFilterApplication] = useState('All');

  const filteredEvents = useMemo(() => {
    if (filterApplication === 'All') return allAuditEvents;
    return allAuditEvents.filter(e => e.applicationId === filterApplication);
  }, [allAuditEvents, filterApplication]);

  const applications = useMemo(
    () => [...new Set(documents.map(d => d.applicationId))],
    [documents]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Audit History
      </Typography>

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <Select
                value={filterApplication}
                onChange={e => setFilterApplication(e.target.value)}
              >
                <MenuItem value="All">All Applications</MenuItem>
                {applications.map(app => (
                  <MenuItem key={app} value={app}>
                    {app}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              Total events: {filteredEvents.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Timeline position="left">
        {filteredEvents.map((event, idx) => (
          <TimelineItem key={event.id}>
            <TimelineOppositeContent sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {new Date(event.timestamp).toLocaleString()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor:
                    event.actor === 'Operator'
                      ? 'primary.main'
                      : event.actor === 'Customer'
                        ? 'success.main'
                        : 'grey.400',
                }}
              />
              {idx < filteredEvents.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ pb: 3 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {event.action}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {event.actorName} ({event.actor})
                    </Typography>
                  </Box>
                  <Chip label={event.applicationId} size="small" variant="outlined" />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                  Document: {event.documentName}
                </Typography>
                {event.comment && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                    "{event.comment}"
                  </Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

const DocumentManagementDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [documents] = useState(generateMockDocuments());

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'documents', label: 'All Documents', icon: <FileIcon /> },
    { id: 'queue', label: 'Verification Queue', icon: <QueueIcon /> },
    { id: 'missing', label: 'Missing Documents', icon: <MissingIcon /> },
    { id: 'audit', label: 'Audit History', icon: <TimelineIcon /> },
  ];

  const sidebar = (
    <Box
      sx={{
        width: { xs: '100%', sm: 250 },
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        p: 2,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DocumentIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          LOS Document Mgmt
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)', mb: 2, textTransform: 'uppercase' }}
      >
        Document Management
      </Typography>

      <Stack spacing={0.5} sx={{ flex: 1 }}>
        {navItems.map(item => (
          <Button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              setMobileOpen(false);
            }}
            sx={{
              justifyContent: 'flex-start',
              pl: 2,
              py: 1,
              color:
                currentPage === item.id
                  ? 'primary.light'
                  : 'rgba(255,255,255,0.7)',
              backgroundColor:
                currentPage === item.id ? 'rgba(33, 150, 243, 0.12)' : 'transparent',
              borderLeft:
                currentPage === item.id ? '3px solid #2196F3' : '3px solid transparent',
              fontSize: '0.875rem',
              fontWeight: currentPage === item.id ? 600 : 400,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
            startIcon={item.icon}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

      <Typography
        variant="caption"
        sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}
      >
        v1.0.0 • Production Ready
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{sidebar}</Box>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        {sidebar}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top AppBar */}
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'block', sm: 'none' }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
              Loan Origination System
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button size="small">Settings</Button>
              <Typography variant="caption" color="textSecondary">
                Operator
              </Typography>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {currentPage === 'dashboard' && <DashboardPage documents={documents} />}
          {currentPage === 'documents' && <AllDocumentsPage documents={documents} />}
          {currentPage === 'queue' && <VerificationQueuePage documents={documents} />}
          {currentPage === 'missing' && <MissingDocumentsPage />}
          {currentPage === 'audit' && <AuditHistoryPage documents={documents} />}
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentManagementDashboard;