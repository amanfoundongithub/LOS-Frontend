import { useState } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";

export const TemplateCreateDialog = (
    { open,
        onClose,
        onSave,
        canCreate = true,
        existingTemplates = []
    }) => {

    const [formData, setFormData] = useState({
        templateCode: '',
        subjectLine: '',
        htmlContent: '',
    });
    const [errors, setErrors] = useState({

    });
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
            setFormData({ code: '', name: '', subject: '', htmlContent: '' });
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
        if (existingTemplates.some((t) => t.templateCode === formData.templateCode)) {
            newErrors.templateCode = 'This template code already exists.';
            setHtmlError('Template with this code already exists.');
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
            <DialogTitle>Create A New Email Template</DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {!canCreate
                    && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            You do not have permission to create templates.
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
                    disabled={!canCreate}
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
                    disabled={!canCreate}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="HTML Content"
                    value={formData.htmlContent}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            htmlContent: e.target.value
                        });
                        setHtmlError('');
                    }}
                    error={!!errors.htmlContent || !!htmlError}
                    helperText={errors.htmlContent || htmlError || 'Enter valid HTML with <html></html> tags for enclosure.'}
                    disabled={!canCreate}
                    sx={{ mb: 2, fontFamily: 'monospace' }}
                    placeholder='<html><body><h1>Hello</h1></body></html>'
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={!canCreate}>
                    Create Template
                </Button>
            </DialogActions>
        </Dialog>
    );
};