export const validateUsername = (username) => {
    const pattern = /^[a-zA-Z0-9_.-]+$/;
    return pattern.test(username);
}