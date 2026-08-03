
export const USER_ROLE_KEY = "userRole";

export const checkIfNotificationAdmin = (userProfile) => {
    if(userProfile.attributes?.[USER_ROLE_KEY] === "NOTIFICATION_SERVICE_ADMIN") {
        return true;
    } 
    return false;
}

export const checkIfIAMAdmin = (userProfile) => {
    if(userProfile.attributes?.[USER_ROLE_KEY] === "ADMIN"){
        return true;
    } 
    return false;
}