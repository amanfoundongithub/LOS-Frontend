import axios from "axios"

import { config } from "../../../shared/config/environment.config";
import { getErrorType } from "../../../shared/http/error.handler";
import { httpErrorTypes } from "../../../shared/http/error.types";
import { getRefreshToken } from "../../../shared/session/refresh-token.refresh";
import { getAccessToken, setAccessToken } from "../../../shared/authStore/access_token.storage";

export const getAllUserStatus = async () => {
    try {
        return await tryAllUserRoles();
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing..df.");
            const newAccessToken = await getRefreshToken();
            setAccessToken(newAccessToken);
            return await tryAllUserRoles();
        } else {
            return null;
        }
    }
}

const tryAllUserRoles = async () => {
    try {
        const accessToken = getAccessToken();
        const res = await axios.get(`${config.BACKEND_SERVICE_BASE_URL}${config.ALL_USER_STATUS_URI}`,
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