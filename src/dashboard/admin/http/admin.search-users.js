import axios from "axios"

import { config } from "../../../shared/config/environment.config";
import { getErrorType } from "../../../shared/http/error.handler";
import { httpErrorTypes } from "../../../shared/http/error.types";
import { getRefreshToken } from "../../../shared/session/refresh-token.refresh";
import { getAccessToken, setAccessToken } from "../../../shared/authStore/access_token.storage";

export const searchAllUsers = async (request) => {
    try {
        return await trySearchAllUsers(request);
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing...");
            const newAccessToken = await getRefreshToken();
            setAccessToken(newAccessToken);
            return await trySearchAllUsers(request);
        } else {
            return null;
        }
    }
}

const trySearchAllUsers = async (request) => {
    try {
        const baseUrl = `${config.BACKEND_SERVICE_BASE_URL}${config.SEARCH_ALL_USERS_URI}`
        const queryParams = new URLSearchParams(request);
        const requestUrl = `${baseUrl}?${queryParams.toString()}`
        const accessToken = getAccessToken();
        const res = await axios.get(requestUrl,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return res.data.content;
    } catch (err) {
        throw err;
    }
}