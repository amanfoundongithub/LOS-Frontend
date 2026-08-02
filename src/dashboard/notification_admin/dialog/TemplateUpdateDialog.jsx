import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

export const TemplateUpdateDialog = (
  { open,
    onClose,
    onSave,
    template,
    canUpdate = true,
  }) => {

  useEffect(() => {
    setFormData({
      templateCode: template?.templateCode || '',
      subjectLine: template?.subjectLine || '',
      htmlContent: template?.htmlContent || '',
    })
  }, [template]);

  const [formData, setFormData] = useState({
    templateCode: template?.templateCode || '',
    subjectLine: template?.subjectLine || '',
    htmlContent: template?.htmlContent || '',
  });
  const [errors, setErrors] = useState({});
  const [htmlError, setHtmlError] = useState('');

  /**
   * Save functionality at the end of the template.
   * 
   * @param None 
   * @returns The functionality for the template modification (create/update)
   */
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      setFormData({ code: '', subject: '', htmlContent: '' });
      setErrors({});
      setHtmlError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.templateCode.trim()) {
      newErrors.templateCode = 'Template code is required.';
    }
    if (!formData.subjectLine.trim()) {
      newErrors.subjectLine = 'Subject line is required.';
    }
    if (!formData.htmlContent.trim()) {
      newErrors.htmlContent = 'HTML content is required.';
    }
    if (formData.htmlContent && !(formData.htmlContent)) {
      setHtmlError('Invalid HTML structure. Please correct it.');
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {`Update "${formData.templateCode}" Template`}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {!canUpdate
          && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You do not have permission to create/update templates.
            </Alert>
          )}

        <TextField
          fullWidth
          label="Template Code"
          value={formData.templateCode}
          onChange={(e) => setFormData({
            ...formData,
            templateCode: e.target.value
          })}
          error={!!errors.templateCode}
          helperText={errors.templateCode}
          disabled
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Subject Line"
          value={formData.subjectLine}
          onChange={(e) => setFormData({
            ...formData,
            subjectLine: e.target.value
          })}
          error={!!errors.subjectLine}
          helperText={errors.subjectLine}
          disabled={!canUpdate}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={8}
          label="HTML Content"
          value={formData.htmlContent}
          onChange={(e) => {
            setFormData({ ...formData, htmlContent: e.target.value });
            setHtmlError('');
          }}
          error={!!errors.htmlContent || !!htmlError}
          helperText={errors.htmlContent || htmlError || 'Valid HTML with <html></html> tags'}
          disabled={!canUpdate}
          sx={{ mb: 2, fontFamily: 'monospace' }}
          placeholder='<html><body><h1>Hello</h1></body></html>'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!canUpdate}>
          Update Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};