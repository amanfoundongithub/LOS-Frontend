import React from 'react';
import { formatHtml } from "../../../utils/html.parser";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Typography,
  Divider,
  Alert,
  Button,
} from '@mui/material';

export const TemplateViewDialog = ({ 
    open, 
    onClose, 
    template = null 
}) => {
  const formattedHtml = template?.htmlContent ? formatHtml(template.htmlContent) : '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
        📧 View Email Template: {template?.name}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                Template Code
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  backgroundColor: '#F3F4F6',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: '#0F4C75',
                  fontWeight: 600,
                }}
              >
                {template?.templateCode}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                Email Subject
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  backgroundColor: '#F3F4F6',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: '#1A2332',
                }}
              >
                {template?.subjectLine}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          📝 Formatted HTML Content
        </Typography>

        {template?.htmlContent ? (
          <Box>
            <Box
              sx={{
                border: '2px solid #D4AF37',
                borderRadius: '8px',
                p: 2,
                backgroundColor: '#FAFAF7',
                maxHeight: '600px',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.8rem',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  lineHeight: '1.6',
                  color: '#0F4C75',
                  '& > span': {
                    display: 'block',
                  },
                }}
              >
                {formattedHtml.split('\n').map((line, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      '&:hover': {
                        backgroundColor: 'rgba(15, 76, 117, 0.05)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: '#8B92A1',
                        mr: 2,
                        minWidth: '40px',
                        textAlign: 'right',
                        userSelect: 'none',
                        fontSize: '0.75rem',
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Box sx={{ flex: 1, color: '#0F4C75' }}>
                      {line || ' '}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 2,
                color: '#8B92A1',
                fontStyle: 'italic',
              }}
            >
              💡 HTML is formatted with proper indentation for readability. Line numbers shown on the left.
            </Typography>
          </Box>
        ) : (
          <Alert severity="info">No HTML content available for this template</Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};