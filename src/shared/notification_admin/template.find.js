import axios from "axios"
import { config } from "../config/environment.config"
import { getAccessToken, setAccessToken } from "../authStore/access_token.storage"
import { getErrorType } from "../http/error.handler";
import { httpErrorTypes } from "../http/error.types";
import { getRefreshToken } from "../session/refresh-token.refresh";

export const findAllNotificationTemplate = async () => {
    try {
        return await tryfindAllNotificationTemplate();
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing...");
            const newAccessToken = await getRefreshToken();
            setAccessToken(newAccessToken);
            return await tryfindAllNotificationTemplate();
        } else {
            return null;
        }
    }
}

const tryfindAllNotificationTemplate = async () => {
    try {
        const accessToken = getAccessToken();
        const res = await axios.get(`${config.BACKEND_NOTIFICATION_SERVICE_BASE_URL}${config.NOTIFICATION_TEMPLATE_FIND_ALL_URI}`,
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