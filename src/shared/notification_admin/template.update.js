import axios from "axios"
import { config } from "../config/environment.config"
import { getAccessToken, setAccessToken } from "../authStore/access_token.storage"
import { getErrorType } from "../http/error.handler";
import { httpErrorTypes } from "../http/error.types";
import { getRefreshToken } from "../session/refresh-token.refresh";

export const updateNotificationTemplate = async (request) => {
    try {
        return await tryNotificationUpdation(request);
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing...");
            const newAccessToken = await getRefreshToken();
            setAccessToken(newAccessToken);
            return await tryNotificationUpdation();
        } else {
            return null;
        }
    }
}

const tryNotificationUpdation = async (request) => {
    try {
        const accessToken = getAccessToken();
        const res = await axios.patch(`${config.BACKEND_NOTIFICATION_SERVICE_BASE_URL}${config.NOTIFICATION_TEMPLATE_CREATE_URI}`,
            {
                templateCode: request.code,
                subjectLine: request.subject,
                htmlContent: request.htmlContent
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return res.data;
    } catch (err) {
        throw err;
    }
}