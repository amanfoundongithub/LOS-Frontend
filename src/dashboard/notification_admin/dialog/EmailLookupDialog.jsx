import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const EmailLookupDialog = ({ open, onClose, onSearch, loading = false }) => {
  const [searchType, setSearchType] = useState('trackingId');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    // Simulate API call
    const mockResults = {
      trackingId: [
        {
          id: 'track-001',
          trackingId: searchValue,
          recipientEmail: 'john@example.com',
          templateCode: 'welcome_email',
          status: 'delivered',
          sentAt: new Date().toISOString(),
        },
      ],
      email: [
        {
          id: 'email-001',
          recipientEmail: searchValue,
          templateCode: 'notification_1',
          status: 'sent',
          sentAt: new Date().toISOString(),
        },
        {
          id: 'email-002',
          recipientEmail: searchValue,
          templateCode: 'weekly_digest',
          status: 'failed',
          sentAt: new Date().toISOString(),
        },
      ],
      templateCode: [
        {
          id: 'tmpl-001',
          templateCode: searchValue,
          name: 'Welcome Email',
          createdAt: new Date().toISOString(),
          usageCount: 1523,
        },
      ],
    };

    setResults(mockResults[searchType] || []);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Search Emails & Templates</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Search By
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {[
              { value: 'trackingId', label: 'Tracking ID' },
              { value: 'email', label: 'Email Recipient' },
              { value: 'templateCode', label: 'Template Code' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={searchType === option.value ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setSearchType(option.value);
                  setSearchValue('');
                  setResults([]);
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </FormControl>

        <TextField
          fullWidth
          placeholder={
            searchType === 'trackingId'
              ? 'Enter tracking ID (e.g., TRACK-123456)'
              : searchType === 'email'
                ? 'Enter email address'
                : 'Enter template code'
          }
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} disabled={loading}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {results.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Search Results ({results.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                    {searchType === 'trackingId' && (
                      <>
                        <TableCell>Tracking ID</TableCell>
                        <TableCell>Recipient Email</TableCell>
                        <TableCell>Template</TableCell>
                        <TableCell>Status</TableCell>
                      </>
                    )}
                    {searchType === 'email' && (
                      <>
                        <TableCell>Email</TableCell>
                        <TableCell>Template</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Sent At</TableCell>
                      </>
                    )}
                    {searchType === 'templateCode' && (
                      <>
                        <TableCell>Template Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Usage Count</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      {searchType === 'trackingId' && (
                        <>
                          <TableCell>{result.trackingId}</TableCell>
                          <TableCell>{result.recipientEmail}</TableCell>
                          <TableCell>{result.templateCode}</TableCell>
                          <TableCell>
                            <Chip
                              label={result.status}
                              size="small"
                              color={result.status === 'delivered' ? 'success' : 'default'}
                            />
                          </TableCell>
                        </>
                      )}
                      {searchType === 'email' && (
                        <>
                          <TableCell>{result.recipientEmail}</TableCell>
                          <TableCell>{result.templateCode}</TableCell>
                          <TableCell>
                            <Chip
                              label={result.status}
                              size="small"
                              color={result.status === 'sent' ? 'success' : result.status === 'failed' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>{new Date(result.sentAt).toLocaleDateString()}</TableCell>
                        </>
                      )}
                      {searchType === 'templateCode' && (
                        <>
                          <TableCell>{result.templateCode}</TableCell>
                          <TableCell>{result.name}</TableCell>
                          <TableCell>{result.usageCount}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {!results.length && searchValue && (
          <Alert severity="info">No results found for your search</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
