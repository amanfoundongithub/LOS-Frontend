import axios from "axios"

import { config } from "../../../shared/config/environment.config";
import { getErrorType } from "../../../shared/http/error.handler";
import { httpErrorTypes } from "../../../shared/http/error.types";
import { getRefreshToken } from "../../../shared/session/refresh-token.refresh";
import { getAccessToken, setAccessToken } from "../../../shared/authStore/access_token.storage";

export const getUserSummary = async () => {
    try {
        return await tryUserSummary();
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing..df.");
            const newAccessToken = await getRefreshToken();
            setAccessToken(newAccessToken);
            return await tryUserSummary();
        } else {
            return null;
        }
    }
}

const tryUserSummary = async () => {
    try {
        const accessToken = getAccessToken();
        const res = await axios.get(`${config.BACKEND_SERVICE_BASE_URL}${config.USER_SUMMARY}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        console.log(res.data);
        return res.data;
    } catch (err) {
        throw err;
    }
}