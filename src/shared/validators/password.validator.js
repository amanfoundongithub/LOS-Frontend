export const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 16) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@#$%^&+=!?.*()_-]/.test(password)) strength++;
    return Math.min(strength, 4);
}

export const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!?.*()_-])[A-Za-z\d@#$%^&+=!?.*()_-]{8,128}$/;
    return pattern.test(password);
};