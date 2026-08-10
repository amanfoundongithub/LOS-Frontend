import axios from "axios"
import { config } from "../config/environment.config"
import { getAccessToken, setAccessToken } from "../authStore/access_token.storage"
import { getErrorType } from "../http/error.handler";
import { httpErrorTypes } from "../http/error.types";
import { getRefreshToken } from "../session/refresh-token.refresh";

export const fetchStats = async () => {
    try {
        return await tryNotificationCreation();
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing...");
            const newAccessToken = await getRefreshToken();
            setAccessToken(newAccessToken);
            return await tryNotificationCreation();
        } else {
            return null;
        }
    }
}

const tryNotificationCreation = async () => {
    try {
        const accessToken = getAccessToken();
        const res = await await axios.get(`${config.BACKEND_NOTIFICATION_SERVICE_BASE_URL}${config.NOTIFICATION_ADMIN_STATS}`, {
        headers : {
          Authorization : `Bearer ${accessToken}`
        }
      });
      
        return res.data;
    } catch (err) {
        throw err;
    }
}